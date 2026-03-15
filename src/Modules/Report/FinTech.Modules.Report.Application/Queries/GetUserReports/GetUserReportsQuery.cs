using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Report.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetUserReports;

public sealed record GetUserReportsQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20) : IRequest<PagedResult<UserReportDto>>;

public sealed record UserReportDto(
    Guid Id,
    string Title,
    ReportType Type,
    ReportStatus Status,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    DateTime? CompletedAt,
    DateTime CreatedAt);
