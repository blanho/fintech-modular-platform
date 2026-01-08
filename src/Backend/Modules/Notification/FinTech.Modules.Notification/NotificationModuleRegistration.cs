namespace FinTech.Modules.Notification;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Infrastructure.Persistence;
using FinTech.Modules.Notification.Infrastructure.Persistence.Repositories;
using FinTech.Modules.Notification.Infrastructure.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class NotificationModuleRegistration
{
    public static IServiceCollection AddNotificationModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {

        services.AddDbContext<NotificationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "notification")));

services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationPreferenceRepository, NotificationPreferenceRepository>();

services.AddScoped<IEmailSender, LoggingEmailSender>();
        services.AddScoped<IPushNotificationSender, LoggingPushNotificationSender>();
        services.AddScoped<ISmsSender, LoggingSmsSender>();
        services.AddScoped<INotificationSender, NotificationSender>();

services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(NotificationModuleRegistration).Assembly));

services.AddValidatorsFromAssembly(typeof(NotificationModuleRegistration).Assembly);

        return services;
    }
}