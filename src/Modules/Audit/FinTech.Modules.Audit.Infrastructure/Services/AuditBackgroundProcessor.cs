using System.Threading.Channels;
using FinTech.Modules.Audit.Application.Interfaces;
using FinTech.Modules.Audit.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Audit.Infrastructure.Services;

public sealed class AuditBackgroundProcessor : BackgroundService
{
    private const int BatchSize = 50;

    private readonly ChannelReader<AuditLog> _reader;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AuditBackgroundProcessor> _logger;

    public AuditBackgroundProcessor(
        ChannelReader<AuditLog> reader,
        IServiceScopeFactory scopeFactory,
        ILogger<AuditBackgroundProcessor> logger)
    {
        _reader = reader;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Audit background processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                if (!await _reader.WaitToReadAsync(stoppingToken))
                    break;

                var batch = new List<AuditLog>(BatchSize);

                while (batch.Count < BatchSize && _reader.TryRead(out var item))
                    batch.Add(item);

                if (batch.Count > 0)
                    await PersistBatchAsync(batch, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error persisting audit log batch");
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }

        await DrainRemainingAsync();

        _logger.LogInformation("Audit background processor stopped");
    }

    private async Task PersistBatchAsync(List<AuditLog> batch, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IAuditLogRepository>();

        await repository.AddRangeAsync(batch, ct);

        _logger.LogDebug("Persisted {Count} audit log entries", batch.Count);
    }

    private async Task DrainRemainingAsync()
    {
        var remaining = new List<AuditLog>();

        while (_reader.TryRead(out var item))
            remaining.Add(item);

        if (remaining.Count <= 0)
            return;

        try
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IAuditLogRepository>();
            await repository.AddRangeAsync(remaining);

            _logger.LogInformation("Drained {Count} remaining audit log entries on shutdown", remaining.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to drain {Count} audit log entries on shutdown", remaining.Count);
        }
    }
}
