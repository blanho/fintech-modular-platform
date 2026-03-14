using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.Wallet.Application.Interfaces;
using FinTech.Modules.Wallet.Application.Services;
using FinTech.Modules.Wallet.Infrastructure.Persistence;
using FinTech.Modules.Wallet.Infrastructure.Persistence.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.Wallet.Api;

public static class WalletModuleRegistration
{
    public static IServiceCollection AddWalletModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<WalletDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "wallet")));

        services.AddScoped<IWalletRepository, WalletRepository>();

        services.AddScoped<IWalletService, WalletService>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(WalletModuleRegistration).Assembly));

        services.AddValidatorsFromAssembly(typeof(WalletModuleRegistration).Assembly);

        return services;
    }
}