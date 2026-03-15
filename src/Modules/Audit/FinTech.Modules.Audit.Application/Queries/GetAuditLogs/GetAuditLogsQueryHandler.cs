using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Audit.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Audit.Application.Queries.GetAuditLogs;

public sealed class GetAuditLogsQueryHandler
    : IRequestHandler<GetAuditLogsQuery, Result<PagedResult<AuditLogDto>>>
{
    private readonly IAuditLogRepository _repository;

    public GetAuditLogsQueryHandler(IAuditLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PagedResult<AuditLogDto>>> Handle(
        GetAuditLogsQuery request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var logs = await _repository.GetByFilterAsync(
            request.UserId,
            request.Action,
            request.ResourceType,
            request.From,
            request.To,
            page,
            pageSize,
            cancellationToken);

        var totalCount = await _repository.CountByFilterAsync(
            request.UserId,
            request.Action,
            request.ResourceType,
            request.From,
            request.To,
            cancellationToken);

        var dtos = logs.Select(log => new AuditLogDto(
            log.Id,
            log.UserId,
            log.Action,
            log.ActionType.ToString(),
            log.ResourceType,
            log.ResourceId,
            log.IsSuccess,
            log.ErrorMessage,
            log.DurationMs,
            log.IpAddress,
            log.CorrelationId,
            log.Timestamp)).ToList();

        var result = new PagedResult<AuditLogDto>(dtos, totalCount, page, pageSize);

        return Result<PagedResult<AuditLogDto>>.Success(result);
    }
}
