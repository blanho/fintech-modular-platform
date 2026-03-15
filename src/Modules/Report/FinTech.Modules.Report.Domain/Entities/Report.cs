using FinTech.BuildingBlocks.Domain;
using FinTech.Modules.Report.Domain.Enums;

namespace FinTech.Modules.Report.Domain.Entities;

public sealed class Report : AggregateRoot<Guid>
{
    private Report() { }

    public string Title { get; private set; } = default!;
    public ReportType Type { get; private set; }
    public ReportStatus Status { get; private set; }
    public Guid RequestedByUserId { get; private set; }
    public DateTime PeriodStart { get; private set; }
    public DateTime PeriodEnd { get; private set; }
    public string? Parameters { get; private set; }
    public string? ResultData { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public long? FileSizeBytes { get; private set; }

    public static Report Create(
        string title,
        ReportType type,
        Guid requestedByUserId,
        DateTime periodStart,
        DateTime periodEnd,
        string? parameters = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Report.InvalidTitle", "Report title cannot be empty.");

        if (periodEnd <= periodStart)
            throw new DomainException("Report.InvalidPeriod", "Period end must be after period start.");

        var report = new Report
        {
            Id = Guid.NewGuid(),
            Title = title,
            Type = type,
            Status = ReportStatus.Pending,
            RequestedByUserId = requestedByUserId,
            PeriodStart = periodStart,
            PeriodEnd = periodEnd,
            Parameters = parameters
        };

        report.SetCreatedAt();
        return report;
    }

    public void MarkAsGenerating()
    {
        if (Status != ReportStatus.Pending)
            throw new DomainException("Report.InvalidTransition", $"Cannot start generating report in {Status} status.");

        Status = ReportStatus.Generating;
        SetUpdatedAt();
    }

    public void Complete(string resultData, long fileSizeBytes)
    {
        if (Status != ReportStatus.Generating)
            throw new DomainException("Report.InvalidTransition", $"Cannot complete report in {Status} status.");

        ResultData = resultData;
        FileSizeBytes = fileSizeBytes;
        Status = ReportStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        SetUpdatedAt();
    }

    public void Fail(string errorMessage)
    {
        if (Status is not (ReportStatus.Pending or ReportStatus.Generating))
            throw new DomainException("Report.InvalidTransition", $"Cannot fail report in {Status} status.");

        ErrorMessage = errorMessage;
        Status = ReportStatus.Failed;
        SetUpdatedAt();
    }

    public void MarkAsExpired()
    {
        if (Status != ReportStatus.Completed)
            throw new DomainException("Report.InvalidTransition", $"Cannot expire report in {Status} status.");

        Status = ReportStatus.Expired;
        ResultData = null;
        SetUpdatedAt();
    }
}
