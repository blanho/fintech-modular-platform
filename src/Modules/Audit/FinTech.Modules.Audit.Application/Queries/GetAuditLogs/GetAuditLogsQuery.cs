using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Audit.Application.Queries.GetAuditLogs;

public sealed record GetAuditLogsQuery(
    Guid? UserId,
    string? Action,
    string? ResourceType,
    DateTime? From,
    DateTime? To,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<PagedResult<AuditLogDto>>>;

public sealed record AuditLogDto(
    Guid Id,
    Guid? UserId,
    string Action,
    string ActionType,
    string ResourceType,
    string? ResourceId,
    bool IsSuccess,
    string? ErrorMessage,
    long DurationMs,
    string? IpAddress,
    string? CorrelationId,
    DateTime Timestamp);
