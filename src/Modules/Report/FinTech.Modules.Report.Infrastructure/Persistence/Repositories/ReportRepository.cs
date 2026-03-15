using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Report.Infrastructure.Persistence.Repositories;

public sealed class ReportRepository : IReportRepository
{
    private readonly ReportDbContext _dbContext;

    public ReportRepository(ReportDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Domain.Entities.Report?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reports.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<Domain.Entities.Report>> GetByUserIdAsync(
        Guid userId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reports
            .Where(r => r.RequestedByUserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Domain.Entities.Report>> GetPendingReportsAsync(
        int batchSize, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reports
            .Where(r => r.Status == ReportStatus.Pending)
            .OrderBy(r => r.CreatedAt)
            .Take(batchSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Reports
            .CountAsync(r => r.RequestedByUserId == userId, cancellationToken);
    }

    public async Task AddAsync(Domain.Entities.Report report, CancellationToken cancellationToken = default)
    {
        await _dbContext.Reports.AddAsync(report, cancellationToken);
    }

    public void Update(Domain.Entities.Report report)
    {
        _dbContext.Reports.Update(report);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
