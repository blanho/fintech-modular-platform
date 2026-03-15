using FinTech.Modules.Report.Domain.Entities;
using FinTech.Modules.Report.Domain.Enums;

namespace FinTech.Modules.Report.Application.Interfaces;

public interface IStatisticsRepository
{
    Task<IReadOnlyList<StatisticsSnapshot>> GetByMetricTypeAsync(
        MetricType metricType,
        DateTime from,
        DateTime to,
        string granularity,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<StatisticsSnapshot>> GetLatestSnapshotsAsync(
        int count,
        CancellationToken cancellationToken = default);

    Task<StatisticsSnapshot?> GetLatestByMetricTypeAsync(
        MetricType metricType,
        CancellationToken cancellationToken = default);

    Task AddAsync(StatisticsSnapshot snapshot, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<StatisticsSnapshot> snapshots, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
