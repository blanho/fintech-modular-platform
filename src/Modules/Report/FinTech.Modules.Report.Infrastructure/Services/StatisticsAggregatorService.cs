using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Entities;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Report.Infrastructure.Services;

public sealed class StatisticsAggregatorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<StatisticsAggregatorService> _logger;
    private static readonly TimeSpan AggregationInterval = TimeSpan.FromMinutes(5);

    public StatisticsAggregatorService(
        IServiceScopeFactory scopeFactory,
        ILogger<StatisticsAggregatorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("StatisticsAggregatorService started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await AggregateStatistics(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error aggregating statistics");
            }

            await Task.Delay(AggregationInterval, stoppingToken);
        }

        _logger.LogInformation("StatisticsAggregatorService stopped");
    }

    private async Task AggregateStatistics(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var statisticsRepository = scope.ServiceProvider.GetRequiredService<IStatisticsRepository>();

        var now = DateTime.UtcNow;
        var snapshots = new List<StatisticsSnapshot>();

        foreach (var metricType in Enum.GetValues<MetricType>())
        {
            var snapshot = StatisticsSnapshot.Create(
                metricType,
                0m,
                now,
                "realtime",
                null,
                null);

            snapshots.Add(snapshot);
        }

        await statisticsRepository.AddRangeAsync(snapshots, stoppingToken);
        await statisticsRepository.SaveChangesAsync(stoppingToken);

        _logger.LogDebug("Aggregated {Count} statistics snapshots", snapshots.Count);
    }
}
