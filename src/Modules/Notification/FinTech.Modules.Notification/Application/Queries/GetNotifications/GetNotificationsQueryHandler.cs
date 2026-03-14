namespace FinTech.Modules.Notification.Application.Queries.GetNotifications;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed class GetNotificationsQueryHandler
    : IRequestHandler<GetNotificationsQuery, Result<GetNotificationsResponse>>
{
    private readonly INotificationRepository _repository;

    public GetNotificationsQueryHandler(INotificationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<GetNotificationsResponse>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var notifications = await _repository.GetByUserIdAsync(
            request.UserId,
            request.Status,
            request.Category,
            request.Page,
            request.PageSize,
            cancellationToken);

        var totalCount = await _repository.GetCountByUserIdAsync(
            request.UserId,
            request.Status,
            request.Category,
            cancellationToken);

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        var dtos = notifications.Select(n => new NotificationDto(
            n.Id.Value,
            n.Type.ToString(),
            n.Category.ToString(),
            n.Status.ToString(),
            n.Subject,
            n.Body,
            n.CreatedAt,
            n.SentAt)).ToList();

        return Result<GetNotificationsResponse>.Success(new GetNotificationsResponse(
            dtos,
            totalCount,
            request.Page,
            request.PageSize,
            totalPages));
    }
}