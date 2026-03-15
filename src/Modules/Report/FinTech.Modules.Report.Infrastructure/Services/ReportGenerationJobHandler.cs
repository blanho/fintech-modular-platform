using System.Text.Json;
using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Report.Infrastructure.Services;

public sealed class ReportGenerationJobHandler : IJobHandler
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReportGenerationJobHandler> _logger;

    public string JobType => "report-generation";

    public ReportGenerationJobHandler(
        IServiceScopeFactory scopeFactory,
        ILogger<ReportGenerationJobHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task ExecuteAsync(Guid jobId, string payload, IJobProgressReporter progress, CancellationToken ct)
    {
        var reportId = JsonSerializer.Deserialize<Guid>(payload);

        using var scope = _scopeFactory.CreateScope();
        var reportRepository = scope.ServiceProvider.GetRequiredService<IReportRepository>();

        var report = await reportRepository.GetByIdAsync(reportId, ct);
        if (report is null)
        {
            _logger.LogWarning("Report {ReportId} not found for job {JobId}", reportId, jobId);
            return;
        }

        try
        {
            report.MarkAsGenerating();
            reportRepository.Update(report);
            await reportRepository.SaveChangesAsync(ct);
            await progress.ReportProgressAsync(10, ct);

            var resultData = await GenerateReportData(report, ct);
            await progress.ReportProgressAsync(80, ct);

            var dataBytes = System.Text.Encoding.UTF8.GetByteCount(resultData);
            report.Complete(resultData, dataBytes);
            reportRepository.Update(report);
            await reportRepository.SaveChangesAsync(ct);
            await progress.ReportProgressAsync(100, ct);

            _logger.LogInformation("Report {ReportId} completed via BackgroundJob {JobId}", reportId, jobId);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Failed to generate report {ReportId} via job {JobId}", reportId, jobId);
            report.Fail(ex.Message);
            reportRepository.Update(report);
            await reportRepository.SaveChangesAsync(ct);
            throw;
        }
    }

    private static Task<string> GenerateReportData(
        Domain.Entities.Report report,
        CancellationToken cancellationToken)
    {
        var data = report.Type switch
        {
            ReportType.TransactionSummary => GenerateTransactionSummary(report),
            ReportType.WalletBalance => GenerateWalletBalanceReport(report),
            ReportType.UserActivity => GenerateUserActivityReport(report),
            ReportType.RevenueAnalysis => GenerateRevenueAnalysisReport(report),
            ReportType.DailyReconciliation => GenerateDailyReconciliationReport(report),
            ReportType.MonthlyStatement => GenerateMonthlyStatementReport(report),
            _ => throw new InvalidOperationException($"Unknown report type: {report.Type}")
        };

        return Task.FromResult(data);
    }

    private static string GenerateTransactionSummary(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "TransactionSummary",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                TotalCount = 0,
                TotalVolume = 0m,
                SuccessCount = 0,
                FailedCount = 0,
                AverageAmount = 0m
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }

    private static string GenerateWalletBalanceReport(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "WalletBalance",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                TotalWallets = 0,
                TotalBalance = 0m,
                AverageBalance = 0m
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }

    private static string GenerateUserActivityReport(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "UserActivity",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                ActiveUsers = 0,
                NewRegistrations = 0,
                TotalLogins = 0
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }

    private static string GenerateRevenueAnalysisReport(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "RevenueAnalysis",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                TotalRevenue = 0m,
                TransactionFees = 0m,
                AverageFeePerTransaction = 0m
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }

    private static string GenerateDailyReconciliationReport(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "DailyReconciliation",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                TotalDebits = 0m,
                TotalCredits = 0m,
                NetBalance = 0m,
                DiscrepancyCount = 0
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }

    private static string GenerateMonthlyStatementReport(Domain.Entities.Report report)
    {
        var result = new
        {
            ReportType = "MonthlyStatement",
            Period = new { report.PeriodStart, report.PeriodEnd },
            Summary = new
            {
                OpeningBalance = 0m,
                ClosingBalance = 0m,
                TotalInflow = 0m,
                TotalOutflow = 0m,
                TransactionCount = 0
            },
            GeneratedAt = DateTime.UtcNow
        };
        return JsonSerializer.Serialize(result);
    }
}
