using System.Text.Json;
using FinTech.Modules.Report.Application.Interfaces;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Report.Infrastructure.Services;

public sealed class ReportGeneratorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReportGeneratorService> _logger;
    private static readonly TimeSpan PollingInterval = TimeSpan.FromSeconds(10);
    private const int BatchSize = 5;

    public ReportGeneratorService(
        IServiceScopeFactory scopeFactory,
        ILogger<ReportGeneratorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReportGeneratorService started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingReports(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing pending reports");
            }

            await Task.Delay(PollingInterval, stoppingToken);
        }

        _logger.LogInformation("ReportGeneratorService stopped");
    }

    private async Task ProcessPendingReports(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var reportRepository = scope.ServiceProvider.GetRequiredService<IReportRepository>();

        var pendingReports = await reportRepository.GetPendingReportsAsync(BatchSize, stoppingToken);
        if (pendingReports.Count == 0) return;

        _logger.LogInformation("Processing {Count} pending reports", pendingReports.Count);

        foreach (var report in pendingReports)
        {
            try
            {
                report.MarkAsGenerating();
                reportRepository.Update(report);
                await reportRepository.SaveChangesAsync(stoppingToken);

                var resultData = await GenerateReportData(report, stoppingToken);
                var dataBytes = System.Text.Encoding.UTF8.GetByteCount(resultData);

                report.Complete(resultData, dataBytes);
                reportRepository.Update(report);
                await reportRepository.SaveChangesAsync(stoppingToken);

                _logger.LogInformation("Report {ReportId} completed successfully", report.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate report {ReportId}", report.Id);
                report.Fail(ex.Message);
                reportRepository.Update(report);
                await reportRepository.SaveChangesAsync(stoppingToken);
            }
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
