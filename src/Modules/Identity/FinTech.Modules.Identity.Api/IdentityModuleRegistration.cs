using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Application.Services;
using FinTech.Modules.Identity.Infrastructure.Persistence;
using FinTech.Modules.Identity.Infrastructure.Persistence.Repositories;
using FinTech.Modules.Identity.Infrastructure.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.Identity.Api;

public static class IdentityModuleRegistration
{
    public static IServiceCollection AddIdentityModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<IdentityDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql =>
                {
                    npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "identity");
                    npgsql.EnableRetryOnFailure(3);
                }));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddScoped<IIdentityService, IdentityService>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(IdentityModuleRegistration).Assembly));

        services.AddValidatorsFromAssembly(typeof(IdentityModuleRegistration).Assembly);

        return services;
    }
}