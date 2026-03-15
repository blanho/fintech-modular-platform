using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetDashboardStatistics;

public sealed record GetDashboardStatisticsQuery : IRequest<DashboardStatisticsDto>;

public sealed record DashboardStatisticsDto(
    decimal TotalTransactions,
    decimal TotalVolume,
    decimal ActiveUsers,
    decimal ActiveWallets,
    decimal SuccessRate,
    decimal AverageTransactionValue,
    decimal NewUsersToday,
    decimal FailedTransactions,
    IReadOnlyList<TimeSeriesPointDto> TransactionTrend,
    IReadOnlyList<TimeSeriesPointDto> VolumeTrend);

public sealed record TimeSeriesPointDto(
    DateTime Timestamp,
    decimal Value);
