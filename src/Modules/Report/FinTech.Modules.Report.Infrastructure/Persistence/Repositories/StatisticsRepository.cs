using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Entities;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Report.Infrastructure.Persistence.Repositories;

public sealed class StatisticsRepository : IStatisticsRepository
{
    private readonly ReportDbContext _dbContext;

    public StatisticsRepository(ReportDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<StatisticsSnapshot>> GetByMetricTypeAsync(
        MetricType metricType,
        DateTime from,
        DateTime to,
        string granularity,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.StatisticsSnapshots
            .Where(s => s.MetricType == metricType
                && s.RecordedAt >= from
                && s.RecordedAt <= to
                && s.Granularity == granularity)
            .OrderBy(s => s.RecordedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<StatisticsSnapshot>> GetLatestSnapshotsAsync(
        int count,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.StatisticsSnapshots
            .OrderByDescending(s => s.RecordedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<StatisticsSnapshot?> GetLatestByMetricTypeAsync(
        MetricType metricType,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.StatisticsSnapshots
            .Where(s => s.MetricType == metricType)
            .OrderByDescending(s => s.RecordedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(StatisticsSnapshot snapshot, CancellationToken cancellationToken = default)
    {
        await _dbContext.StatisticsSnapshots.AddAsync(snapshot, cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<StatisticsSnapshot> snapshots, CancellationToken cancellationToken = default)
    {
        await _dbContext.StatisticsSnapshots.AddRangeAsync(snapshots, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
