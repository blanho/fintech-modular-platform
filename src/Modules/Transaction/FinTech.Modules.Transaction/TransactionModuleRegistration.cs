namespace FinTech.Modules.Transaction;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using FinTech.Modules.Transaction.Infrastructure.Persistence;
using FinTech.Modules.Transaction.Infrastructure.Persistence.Repositories;
using FinTech.Modules.Transaction.Application.Interfaces;

public static class TransactionModuleRegistration
{
    public static IServiceCollection AddTransactionModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {

        services.AddDbContext<TransactionDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "transaction")));

services.AddScoped<ITransactionRepository, TransactionRepository>();

services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(TransactionModuleRegistration).Assembly));

services.AddValidatorsFromAssembly(typeof(TransactionModuleRegistration).Assembly);

        return services;
    }
}