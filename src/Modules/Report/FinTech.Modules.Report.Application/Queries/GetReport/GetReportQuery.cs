using FinTech.Modules.Report.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetReport;

public sealed record GetReportQuery(Guid ReportId) : IRequest<ReportDto?>;

public sealed record ReportDto(
    Guid Id,
    string Title,
    ReportType Type,
    ReportStatus Status,
    Guid RequestedByUserId,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    string? Parameters,
    string? ErrorMessage,
    DateTime? CompletedAt,
    long? FileSizeBytes,
    DateTime CreatedAt);
