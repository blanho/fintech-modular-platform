using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Infrastructure.Persistence;
using FinTech.Modules.Report.Infrastructure.Persistence.Repositories;
using FinTech.Modules.Report.Infrastructure.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.Report.Api;

public static class ReportModuleRegistration
{
    public static IServiceCollection AddReportModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ReportDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "report")));

        services.AddScoped<IReportRepository, ReportRepository>();
        services.AddScoped<IStatisticsRepository, StatisticsRepository>();

        services.AddHostedService<ReportGeneratorService>();
        services.AddHostedService<StatisticsAggregatorService>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(ReportModuleRegistration).Assembly));

        services.AddValidatorsFromAssembly(typeof(ReportModuleRegistration).Assembly);

        return services;
    }
}
