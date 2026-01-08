namespace FinTech.Modules.Ledger;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using FinTech.Modules.Ledger.Infrastructure.Persistence;
using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Infrastructure.Persistence.Repositories;
using FinTech.SharedKernel.Contracts;
using FinTech.Modules.Ledger.Application.Services;
using FluentValidation;

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