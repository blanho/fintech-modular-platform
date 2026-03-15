using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.BackgroundJob.Application.Interfaces;
using FinTech.Modules.BackgroundJob.Domain.Entities;

namespace FinTech.Modules.BackgroundJob.Application.Services;

public sealed class BackgroundJobService : IBackgroundJobService
{
    private readonly IJobRepository _jobRepository;

    public BackgroundJobService(IJobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    public async Task<Guid> EnqueueAsync(string jobType, string payload, CancellationToken ct = default)
    {
        var job = Job.Create(jobType, payload);
        await _jobRepository.AddAsync(job, ct);
        await _jobRepository.SaveChangesAsync(ct);
        return job.Id;
    }

    public async Task<BackgroundJobStatus?> GetStatusAsync(Guid jobId, CancellationToken ct = default)
    {
        var job = await _jobRepository.GetByIdAsync(jobId, ct);
        if (job is null)
            return null;

        return new BackgroundJobStatus(
            job.Id,
            job.JobType,
            job.Status.ToString(),
            job.ProgressPercentage,
            job.ResultPayload,
            job.ErrorMessage,
            job.CreatedAt,
            job.StartedAt,
            job.CompletedAt);
    }

    public async Task RequestCancellationAsync(Guid jobId, CancellationToken ct = default)
    {
        var job = await _jobRepository.GetByIdAsync(jobId, ct);
        if (job is null)
            return;

        job.RequestCancellation();
        _jobRepository.Update(job);
        await _jobRepository.SaveChangesAsync(ct);
    }
}
