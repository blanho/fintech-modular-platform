using FinTech.Modules.BackgroundJob.Application.Interfaces;
using FinTech.Modules.BackgroundJob.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.BackgroundJob.Infrastructure.Services;

public sealed class JobProcessor : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<JobProcessor> _logger;
    private static readonly TimeSpan PollingInterval = TimeSpan.FromSeconds(5);

    public JobProcessor(
        IServiceScopeFactory scopeFactory,
        ILogger<JobProcessor> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background job processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingJobsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error processing background jobs");
            }

            await Task.Delay(PollingInterval, stoppingToken);
        }

        _logger.LogInformation("Background job processor stopped");
    }

    private async Task ProcessPendingJobsAsync(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IJobRepository>();
        var handlers = scope.ServiceProvider.GetServices<IJobHandler>().ToList();

        var pendingJobs = await repository.GetPendingJobsAsync(10, stoppingToken);

        foreach (var job in pendingJobs)
        {
            if (stoppingToken.IsCancellationRequested)
                break;

            var handler = handlers.FirstOrDefault(h => h.JobType == job.JobType);
            if (handler is null)
            {
                _logger.LogWarning("No handler found for job type {JobType}, job {JobId}", job.JobType, job.Id);
                job.Fail($"No handler registered for job type '{job.JobType}'");
                repository.Update(job);
                await repository.SaveChangesAsync(stoppingToken);
                continue;
            }

            await ExecuteJobAsync(job, handler, repository, stoppingToken);
        }
    }

    private async Task ExecuteJobAsync(
        Job job,
        IJobHandler handler,
        IJobRepository repository,
        CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting job {JobId} of type {JobType}", job.Id, job.JobType);

        job.Start();
        repository.Update(job);
        await repository.SaveChangesAsync(stoppingToken);

        using var jobCts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
        var progressReporter = new JobProgressReporter(job, repository, jobCts.Token);

        try
        {
            await handler.ExecuteAsync(job.Id, job.Payload, progressReporter, jobCts.Token);

            if (job.IsCancellationRequested)
            {
                job.Cancel();
                _logger.LogInformation("Job {JobId} was cancelled", job.Id);
            }
            else
            {
                job.Complete();
                _logger.LogInformation("Job {JobId} completed successfully", job.Id);
            }
        }
        catch (OperationCanceledException) when (job.IsCancellationRequested)
        {
            job.Cancel();
            _logger.LogInformation("Job {JobId} was cancelled", job.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Job {JobId} failed with error", job.Id);
            job.Fail(ex.Message);
        }

        repository.Update(job);
        await repository.SaveChangesAsync(stoppingToken);
    }
}

internal sealed class JobProgressReporter : IJobProgressReporter
{
    private readonly Job _job;
    private readonly IJobRepository _repository;
    private readonly CancellationToken _ct;

    public JobProgressReporter(Job job, IJobRepository repository, CancellationToken ct)
    {
        _job = job;
        _repository = repository;
        _ct = ct;
    }

    public bool IsCancellationRequested => _job.IsCancellationRequested;

    public async Task ReportProgressAsync(int percentage, CancellationToken ct = default)
    {
        _job.UpdateProgress(percentage);
        _repository.Update(_job);
        await _repository.SaveChangesAsync(ct == default ? _ct : ct);
    }
}
