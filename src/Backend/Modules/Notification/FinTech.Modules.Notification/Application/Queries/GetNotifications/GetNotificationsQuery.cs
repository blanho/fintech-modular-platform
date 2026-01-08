namespace FinTech.Modules.Notification.Application.Queries.GetNotifications;

using FinTech.Modules.Notification.Domain.Enums;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed record GetNotificationsQuery(
    UserId UserId,
    NotificationStatus? Status = null,
    NotificationCategory? Category = null,
    int Page = 1,
    int PageSize = 20) : IRequest<Result<GetNotificationsResponse>>;

public sealed record GetNotificationsResponse(
    IReadOnlyList<NotificationDto> Notifications,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages);

public sealed record NotificationDto(
    Guid NotificationId,
    string Type,
    string Category,
    string Status,
    string Subject,
    string Body,
    DateTime CreatedAt,
    DateTime? SentAt);