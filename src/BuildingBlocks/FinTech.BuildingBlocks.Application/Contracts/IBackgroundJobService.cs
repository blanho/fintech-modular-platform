namespace FinTech.BuildingBlocks.Application.Contracts;

public interface IBackgroundJobService
{
    Task<Guid> EnqueueAsync(string jobType, string payload, CancellationToken ct = default);
    Task<BackgroundJobStatus?> GetStatusAsync(Guid jobId, CancellationToken ct = default);
    Task RequestCancellationAsync(Guid jobId, CancellationToken ct = default);
}

public sealed record BackgroundJobStatus(
    Guid JobId,
    string JobType,
    string Status,
    int ProgressPercentage,
    string? ResultPayload,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime? StartedAt,
    DateTime? CompletedAt);
