using System.Threading.Channels;
using FinTech.BuildingBlocks.Application.Abstractions;
using FinTech.BuildingBlocks.Infrastructure.Services;
using FinTech.Modules.Audit.Application.Interfaces;
using FinTech.Modules.Audit.Application.Services;
using FinTech.Modules.Audit.Domain.Entities;
using FinTech.Modules.Audit.Infrastructure.Persistence;
using FinTech.Modules.Audit.Infrastructure.Persistence.Repositories;
using FinTech.Modules.Audit.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.Audit.Api;

public static class AuditModuleRegistration
{
    public static IServiceCollection AddAuditModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var channel = Channel.CreateBounded<AuditLog>(
            new BoundedChannelOptions(10_000)
            {
                FullMode = BoundedChannelFullMode.DropOldest,
                SingleReader = true
            });

        services.AddSingleton(channel.Reader);
        services.AddSingleton(channel.Writer);

        services.AddDbContext<AuditDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql =>
                {
                    npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "audit");
                    npgsql.EnableRetryOnFailure(3);
                }));

        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IRequestContext, HttpRequestContext>();

        services.AddHostedService<AuditBackgroundProcessor>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(AuditModuleRegistration).Assembly));

        return services;
    }
}
