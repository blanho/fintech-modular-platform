using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Report.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Report.Application.Queries.GetUserReports;

internal sealed class GetUserReportsQueryHandler
    : IRequestHandler<GetUserReportsQuery, PagedResult<UserReportDto>>
{
    private readonly IReportRepository _reportRepository;

    public GetUserReportsQueryHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<PagedResult<UserReportDto>> Handle(
        GetUserReportsQuery request,
        CancellationToken cancellationToken)
    {
        var totalCount = await _reportRepository.CountByUserIdAsync(request.UserId, cancellationToken);
        var reports = await _reportRepository.GetByUserIdAsync(
            request.UserId, request.Page, request.PageSize, cancellationToken);

        var items = reports.Select(r => new UserReportDto(
            r.Id,
            r.Title,
            r.Type,
            r.Status,
            r.PeriodStart,
            r.PeriodEnd,
            r.CompletedAt,
            r.CreatedAt)).ToList();

        return new PagedResult<UserReportDto>(items, totalCount, request.Page, request.PageSize);
    }
}
