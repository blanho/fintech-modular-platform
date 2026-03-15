using FinTech.Modules.BackgroundJob.Domain.Entities;
using FinTech.Modules.BackgroundJob.Domain.Enums;

namespace FinTech.Modules.BackgroundJob.Application.Interfaces;

public interface IJobRepository
{
    Task<Job?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Job>> GetPendingJobsAsync(int batchSize, CancellationToken ct = default);
    Task<IReadOnlyList<Job>> GetByStatusAsync(JobStatus status, int page, int pageSize, CancellationToken ct = default);
    Task<int> CountByStatusAsync(JobStatus status, CancellationToken ct = default);
    Task AddAsync(Job job, CancellationToken ct = default);
    void Update(Job job);
    Task SaveChangesAsync(CancellationToken ct = default);
}
