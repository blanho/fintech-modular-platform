using MediatR;

namespace FinTech.Modules.Report.Application.Queries.ExportReport;

public sealed record ExportReportQuery(Guid ReportId) : IRequest<ExportReportResult?>;

public sealed record ExportReportResult(
    string FileName,
    string ContentType,
    byte[] Content);
