using FinTech.Modules.Identity.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Identity.Infrastructure.Services;

public sealed class RoleSeedingService : IHostedService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RoleSeedingService> _logger;

    public RoleSeedingService(
        IServiceScopeFactory scopeFactory,
        ILogger<RoleSeedingService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Seeding default roles and permissions...");

        using var scope = _scopeFactory.CreateScope();
        var roleRepository = scope.ServiceProvider.GetRequiredService<IRoleRepository>();

        await roleRepository.SeedRolesAsync(cancellationToken);

        _logger.LogInformation("Default roles and permissions seeded successfully");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
