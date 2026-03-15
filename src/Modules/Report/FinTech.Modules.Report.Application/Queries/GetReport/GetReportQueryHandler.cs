using FinTech.Modules.Report.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetReport;

internal sealed class GetReportQueryHandler : IRequestHandler<GetReportQuery, ReportDto?>
{
    private readonly IReportRepository _reportRepository;

    public GetReportQueryHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<ReportDto?> Handle(GetReportQuery request, CancellationToken cancellationToken)
    {
        var report = await _reportRepository.GetByIdAsync(request.ReportId, cancellationToken);
        if (report is null)
            return null;

        return new ReportDto(
            report.Id,
            report.Title,
            report.Type,
            report.Status,
            report.RequestedByUserId,
            report.PeriodStart,
            report.PeriodEnd,
            report.Parameters,
            report.ErrorMessage,
            report.CompletedAt,
            report.FileSizeBytes,
            report.CreatedAt);
    }
}
