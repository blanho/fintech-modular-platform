using Microsoft.AspNetCore.Builder;
using Serilog;

namespace FinTech.BuildingBlocks.Observability;

public static class ObservabilityExtensions
{
    public static WebApplicationBuilder AddObservability(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, loggerConfig) =>
        {
            loggerConfig.ReadFrom.Configuration(context.Configuration);
        });

        return builder;
    }

    public static WebApplication UseObservability(this WebApplication app)
    {
        app.UseSerilogRequestLogging(options =>
        {
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value ?? string.Empty);
                diagnosticContext.Set("UserAgent",
                    httpContext.Request.Headers.UserAgent.FirstOrDefault() ?? string.Empty);

                if (httpContext.Items.TryGetValue("CorrelationId", out var correlationId))
                    diagnosticContext.Set("CorrelationId", correlationId?.ToString() ?? string.Empty);
            };
        });

        return app;
    }
}