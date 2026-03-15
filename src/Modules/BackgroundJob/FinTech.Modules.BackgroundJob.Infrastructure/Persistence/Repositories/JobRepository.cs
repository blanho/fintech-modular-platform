using FinTech.Modules.BackgroundJob.Application.Interfaces;
using FinTech.Modules.BackgroundJob.Domain.Entities;
using FinTech.Modules.BackgroundJob.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.BackgroundJob.Infrastructure.Persistence.Repositories;

public sealed class JobRepository : IJobRepository
{
    private readonly BackgroundJobDbContext _context;

    public JobRepository(BackgroundJobDbContext context)
    {
        _context = context;
    }

    public async Task<Job?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Jobs.FirstOrDefaultAsync(j => j.Id == id, ct);
    }

    public async Task<IReadOnlyList<Job>> GetPendingJobsAsync(int batchSize, CancellationToken ct = default)
    {
        return await _context.Jobs
            .Where(j => j.Status == JobStatus.Pending)
            .OrderBy(j => j.CreatedAt)
            .Take(batchSize)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Job>> GetByStatusAsync(JobStatus status, int page, int pageSize, CancellationToken ct = default)
    {
        return await _context.Jobs
            .Where(j => j.Status == status)
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<int> CountByStatusAsync(JobStatus status, CancellationToken ct = default)
    {
        return await _context.Jobs.CountAsync(j => j.Status == status, ct);
    }

    public async Task AddAsync(Job job, CancellationToken ct = default)
    {
        await _context.Jobs.AddAsync(job, ct);
    }

    public void Update(Job job)
    {
        _context.Jobs.Update(job);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}
