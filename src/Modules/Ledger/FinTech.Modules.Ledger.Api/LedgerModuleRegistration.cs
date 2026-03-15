using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Application.Services;
using FinTech.Modules.Ledger.Infrastructure.Persistence;
using FinTech.Modules.Ledger.Infrastructure.Persistence.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTech.Modules.Ledger.Api;

public static class LedgerModuleRegistration
{
    public static IServiceCollection AddLedgerModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<LedgerDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql =>
                {
                    npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "ledger");
                    npgsql.EnableRetryOnFailure(3);
                }));

        services.AddScoped<ILedgerRepository, LedgerRepository>();

        services.AddScoped<ILedgerService, LedgerService>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(LedgerModuleRegistration).Assembly));

        services.AddValidatorsFromAssembly(typeof(LedgerModuleRegistration).Assembly);

        return services;
    }
}
