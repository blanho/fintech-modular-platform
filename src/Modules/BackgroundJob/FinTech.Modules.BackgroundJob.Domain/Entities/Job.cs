using FinTech.Modules.BackgroundJob.Domain.Enums;

namespace FinTech.Modules.BackgroundJob.Domain.Entities;

public sealed class Job
{
    private Job() { }

    public Guid Id { get; private set; }
    public string JobType { get; private set; } = null!;
    public string Payload { get; private set; } = null!;
    public JobStatus Status { get; private set; }
    public int ProgressPercentage { get; private set; }
    public string? ResultPayload { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public int RetryCount { get; private set; }
    public int MaxRetries { get; private set; }

    public bool IsCancellationRequested { get; private set; }

    public static Job Create(string jobType, string payload, Guid? createdBy = null, int maxRetries = 3)
    {
        return new Job
        {
            Id = Guid.NewGuid(),
            JobType = jobType,
            Payload = payload,
            Status = JobStatus.Pending,
            ProgressPercentage = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy,
            MaxRetries = maxRetries
        };
    }

    public void Start()
    {
        Status = JobStatus.Running;
        StartedAt = DateTime.UtcNow;
    }

    public void UpdateProgress(int percentage)
    {
        ProgressPercentage = Math.Clamp(percentage, 0, 100);
    }

    public void Complete(string? resultPayload = null)
    {
        Status = JobStatus.Completed;
        ProgressPercentage = 100;
        ResultPayload = resultPayload;
        CompletedAt = DateTime.UtcNow;
    }

    public void Fail(string errorMessage)
    {
        RetryCount++;

        if (RetryCount < MaxRetries)
        {
            Status = JobStatus.Pending;
            ErrorMessage = errorMessage;
            return;
        }

        Status = JobStatus.Failed;
        ErrorMessage = errorMessage;
        CompletedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = JobStatus.Cancelled;
        CompletedAt = DateTime.UtcNow;
    }

    public void RequestCancellation()
    {
        IsCancellationRequested = true;
    }
}
