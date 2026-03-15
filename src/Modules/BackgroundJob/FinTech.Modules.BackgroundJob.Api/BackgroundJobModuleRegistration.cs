using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.BackgroundJob.Application.Interfaces;
using FinTech.Modules.BackgroundJob.Application.Services;
using FinTech.Modules.BackgroundJob.Infrastructure.Persistence;
using FinTech.Modules.BackgroundJob.Infrastructure.Persistence.Repositories;
using FinTech.Modules.BackgroundJob.Infrastructure.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.BackgroundJob.Api;

public static class BackgroundJobModuleRegistration
{
    public static IServiceCollection AddBackgroundJobModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<BackgroundJobDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql =>
                {
                    npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "background_job");
                    npgsql.EnableRetryOnFailure(3);
                }));

        services.AddScoped<IJobRepository, JobRepository>();
        services.AddScoped<IBackgroundJobService, BackgroundJobService>();

        services.AddHostedService<JobProcessor>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(BackgroundJobModuleRegistration).Assembly));

        services.AddValidatorsFromAssembly(typeof(BackgroundJobModuleRegistration).Assembly);

        return services;
    }
}
