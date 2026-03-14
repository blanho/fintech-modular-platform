namespace FinTech.Modules.Notification.Application.EventHandlers;

using FinTech.Modules.Identity.Domain.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.SharedKernel.Primitives;
using MediatR;
using Microsoft.Extensions.Logging;

public sealed class UserCreatedEventHandler : INotificationHandler<UserCreatedEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly INotificationSender _sender;
    private readonly ILogger<UserCreatedEventHandler> _logger;

    public UserCreatedEventHandler(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        INotificationSender sender,
        ILogger<UserCreatedEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _sender = sender;
        _logger = logger;
    }

    public async Task Handle(UserCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling UserCreatedEvent for user {UserId} ({Email})",
            notification.UserId,
            notification.Email);

        try
        {

            var preferencesResult = NotificationPreference.CreateDefault(notification.UserId);
            if (preferencesResult.IsSuccess)
            {
                await _preferenceRepository.AddAsync(preferencesResult.Value!, cancellationToken);
                await _preferenceRepository.SaveChangesAsync(cancellationToken);
            }

var welcomeNotification = Domain.Entities.Notification.Create(
                notification.UserId,
                NotificationType.Email,
                NotificationCategory.Account,
                "Welcome to FinTech Platform!",
                $"Hello and welcome to FinTech Platform! Your account has been created successfully with email: {notification.Email}. Start exploring our features and manage your finances with ease.",
                notification.Email,
                notification.UserId.Value,
                "User");

            if (welcomeNotification.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to create welcome notification for user {UserId}: {Error}",
                    notification.UserId,
                    welcomeNotification.Error.Message);
                return;
            }

            await _notificationRepository.AddAsync(welcomeNotification.Value!, cancellationToken);
            await _notificationRepository.SaveChangesAsync(cancellationToken);

var sendResult = await _sender.SendAsync(welcomeNotification.Value!, cancellationToken);

            if (sendResult.IsSuccess)
            {
                welcomeNotification.Value!.MarkAsSent();
            }
            else
            {
                welcomeNotification.Value!.MarkAsFailed(sendResult.Error.Message);
            }

            await _notificationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Welcome notification {NotificationId} {Status} for user {UserId}",
                welcomeNotification.Value!.Id,
                sendResult.IsSuccess ? "sent" : "failed",
                notification.UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error handling UserCreatedEvent for user {UserId}",
                notification.UserId);
        }
    }
}