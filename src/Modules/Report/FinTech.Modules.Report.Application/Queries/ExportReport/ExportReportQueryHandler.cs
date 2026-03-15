using System.Text;
using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.ExportReport;

internal sealed class ExportReportQueryHandler : IRequestHandler<ExportReportQuery, ExportReportResult?>
{
    private readonly IReportRepository _reportRepository;

    public ExportReportQueryHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<ExportReportResult?> Handle(ExportReportQuery request, CancellationToken cancellationToken)
    {
        var report = await _reportRepository.GetByIdAsync(request.ReportId, cancellationToken);
        if (report is null || report.Status != ReportStatus.Completed || report.ResultData is null)
            return null;

        var csvContent = GenerateCsv(report);
        var fileName = $"{report.Type}_{report.PeriodStart:yyyyMMdd}_{report.PeriodEnd:yyyyMMdd}.csv";

        return new ExportReportResult(
            fileName,
            "text/csv",
            Encoding.UTF8.GetBytes(csvContent));
    }

    private static string GenerateCsv(Domain.Entities.Report report)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Report Export");
        sb.AppendLine($"Title,{report.Title}");
        sb.AppendLine($"Type,{report.Type}");
        sb.AppendLine($"Period,{report.PeriodStart:yyyy-MM-dd} to {report.PeriodEnd:yyyy-MM-dd}");
        sb.AppendLine($"Generated,{report.CompletedAt:yyyy-MM-dd HH:mm:ss UTC}");
        sb.AppendLine();
        sb.AppendLine("Data");
        sb.AppendLine(report.ResultData);

        return sb.ToString();
    }
}
