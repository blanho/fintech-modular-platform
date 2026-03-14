using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using FinTech.Api.Middleware;
using FinTech.Api.Swagger;
using FinTech.BuildingBlocks.Application.Behaviors;
using FinTech.BuildingBlocks.EventBus;
using FinTech.BuildingBlocks.Infrastructure.Caching;
using FinTech.Modules.Identity.Api;
using FinTech.Modules.Ledger.Api;
using FinTech.Modules.Notification.Api;
using FinTech.Modules.Notification.Application.Consumers;
using FinTech.Modules.Transaction.Api;
using FinTech.Modules.Wallet.Api;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "FinTech.Api")
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(IdentityModuleRegistration).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(WalletModuleRegistration).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(LedgerModuleRegistration).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(TransactionModuleRegistration).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(NotificationModuleRegistration).Assembly);

    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

builder.Services.AddIdentityModule(builder.Configuration);
builder.Services.AddLedgerModule(builder.Configuration);
builder.Services.AddWalletModule(builder.Configuration);
builder.Services.AddTransactionModule(builder.Configuration);
builder.Services.AddNotificationModule(builder.Configuration);

var jwtSecret = builder.Configuration["Jwt:Secret"]
                ?? throw new InvalidOperationException("JWT Secret is not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("JWT Issuer is not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"]
                  ?? throw new InvalidOperationException("JWT Audience is not configured");

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Log.Warning("Authentication failed: {Error}", context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var userId = context.Principal?.FindFirst("sub")?.Value;
                Log.Debug("Token validated for user: {UserId}", userId);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("X-Correlation-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset");
    });
});

var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "FinTech:";
});
builder.Services.AddScoped<ICacheService, RedisCacheService>();

Log.Information("Redis caching configured with connection: {RedisConnection}", redisConnectionString);

var rabbitMqHost = builder.Configuration["RabbitMQ:Host"] ?? "localhost";
var rabbitMqUser = builder.Configuration["RabbitMQ:Username"] ?? "fintech";
var rabbitMqPassword = builder.Configuration["RabbitMQ:Password"] ?? "fintech_dev_password";

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<TransactionCompletedIntegrationEventConsumer>();
    x.AddConsumer<TransactionFailedIntegrationEventConsumer>();
    x.AddConsumer<SendEmailIntegrationEventConsumer>();
    x.AddConsumer<UserCreatedIntegrationEventConsumer>();
    x.AddConsumer<UserPasswordChangedIntegrationEventConsumer>();
    x.AddConsumer<WalletCreatedIntegrationEventConsumer>();
    x.AddConsumer<BalanceChangedIntegrationEventConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(rabbitMqHost, "/", h =>
        {
            h.Username(rabbitMqUser);
            h.Password(rabbitMqPassword);
        });

        cfg.UseMessageRetry(r => r.Intervals(TimeSpan.FromSeconds(1),
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(15),
            TimeSpan.FromSeconds(30)));

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddScoped<IEventPublisher, MassTransitEventPublisher>();

Log.Information("MassTransit/RabbitMQ configured with host: {RabbitMqHost}", rabbitMqHost);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FinTech Platform API",
        Version = "v1",
        Description = "Financial technology platform API for managing users, wallets, and transactions",
        Contact = new OpenApiContact
        {
            Name = "FinTech Support",
            Email = "support@fintech.com"
        }
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description =
            "Enter 'Bearer' followed by a space and then your token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    options.OperationFilter<IdempotencyKeyOperationFilter>();
});

builder.Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString("DefaultConnection")!,
        name: "database",
        tags: new[] { "db", "postgresql", "ready" })
    .AddRedis(
        builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379",
        "cache",
        tags: new[] { "cache", "redis", "ready" })
    .AddRabbitMQ(
        $"amqp://{rabbitMqUser}:{rabbitMqPassword}@{rabbitMqHost}:5672/",
        name: "messaging",
        tags: new[] { "messaging", "rabbitmq", "ready" });

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseMiddleware<IdempotencyMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "FinTech API v1");
        options.RoutePrefix = "swagger";
    });
}

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

app.UseHttpsRedirection();
app.UseCors("DefaultPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers.UserAgent);

        if (httpContext.Items.TryGetValue("CorrelationId", out var correlationId))
            diagnosticContext.Set("CorrelationId", correlationId);
    };
});

app.MapControllers();

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = WriteHealthCheckResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteHealthCheckResponse
});

app.MapGet("/", () => Results.Ok(new
{
    name = "FinTech Platform API",
    version = "1.0.0",
    status = "running",
    documentation = "/swagger"
}));

Log.Information("FinTech API starting...");
Log.Information("Environment: {Environment}", app.Environment.EnvironmentName);

app.Run();

static async Task WriteHealthCheckResponse(HttpContext context, HealthReport report)
{
    context.Response.ContentType = "application/json";

    var response = new
    {
        status = report.Status.ToString(),
        checks = report.Entries.Select(entry => new
        {
            name = entry.Key,
            status = entry.Value.Status.ToString(),
            description = entry.Value.Description,
            duration = entry.Value.Duration.TotalMilliseconds
        }),
        totalDuration = report.TotalDuration.TotalMilliseconds
    };

    await context.Response.WriteAsJsonAsync(response);
}

public partial class Program
{
}