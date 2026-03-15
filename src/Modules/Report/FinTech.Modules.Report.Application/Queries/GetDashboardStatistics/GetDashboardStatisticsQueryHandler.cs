using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetDashboardStatistics;

internal sealed class GetDashboardStatisticsQueryHandler
    : IRequestHandler<GetDashboardStatisticsQuery, DashboardStatisticsDto>
{
    private readonly IStatisticsRepository _statisticsRepository;

    public GetDashboardStatisticsQueryHandler(IStatisticsRepository statisticsRepository)
    {
        _statisticsRepository = statisticsRepository;
    }

    public async Task<DashboardStatisticsDto> Handle(
        GetDashboardStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        var totalTransactions = await GetLatestMetricValue(MetricType.TotalTransactions, cancellationToken);
        var totalVolume = await GetLatestMetricValue(MetricType.TotalVolume, cancellationToken);
        var activeUsers = await GetLatestMetricValue(MetricType.ActiveUsers, cancellationToken);
        var activeWallets = await GetLatestMetricValue(MetricType.ActiveWallets, cancellationToken);
        var successRate = await GetLatestMetricValue(MetricType.SuccessRate, cancellationToken);
        var avgTxValue = await GetLatestMetricValue(MetricType.AverageTransactionValue, cancellationToken);
        var newUsers = await GetLatestMetricValue(MetricType.NewUsers, cancellationToken);
        var failedTx = await GetLatestMetricValue(MetricType.FailedTransactions, cancellationToken);

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var now = DateTime.UtcNow;

        var transactionTrend = await _statisticsRepository.GetByMetricTypeAsync(
            MetricType.TotalTransactions, thirtyDaysAgo, now, "daily", cancellationToken);

        var volumeTrend = await _statisticsRepository.GetByMetricTypeAsync(
            MetricType.TotalVolume, thirtyDaysAgo, now, "daily", cancellationToken);

        return new DashboardStatisticsDto(
            totalTransactions,
            totalVolume,
            activeUsers,
            activeWallets,
            successRate,
            avgTxValue,
            newUsers,
            failedTx,
            transactionTrend.Select(s => new TimeSeriesPointDto(s.RecordedAt, s.Value)).ToList(),
            volumeTrend.Select(s => new TimeSeriesPointDto(s.RecordedAt, s.Value)).ToList());
    }

    private async Task<decimal> GetLatestMetricValue(MetricType metricType, CancellationToken cancellationToken)
    {
        var snapshot = await _statisticsRepository.GetLatestByMetricTypeAsync(metricType, cancellationToken);
        return snapshot?.Value ?? 0;
    }
}
