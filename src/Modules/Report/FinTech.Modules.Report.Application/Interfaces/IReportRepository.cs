using FinTech.Modules.Report.Domain.Entities;
using FinTech.Modules.Report.Domain.Enums;

namespace FinTech.Modules.Report.Application.Interfaces;

public interface IReportRepository
{
    Task<Domain.Entities.Report?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Entities.Report>> GetByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Entities.Report>> GetPendingReportsAsync(int batchSize, CancellationToken cancellationToken = default);
    Task<int> CountByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Entities.Report report, CancellationToken cancellationToken = default);
    void Update(Domain.Entities.Report report);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
