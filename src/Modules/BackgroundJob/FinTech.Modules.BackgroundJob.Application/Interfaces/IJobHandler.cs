namespace FinTech.Modules.BackgroundJob.Application.Interfaces;

public interface IJobHandler
{
    string JobType { get; }
    Task ExecuteAsync(Guid jobId, string payload, IJobProgressReporter progress, CancellationToken ct);
}

public interface IJobProgressReporter
{
    Task ReportProgressAsync(int percentage, CancellationToken ct = default);
    bool IsCancellationRequested { get; }
}
