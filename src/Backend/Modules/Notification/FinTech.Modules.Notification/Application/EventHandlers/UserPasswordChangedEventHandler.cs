namespace FinTech.Modules.Notification.Application.EventHandlers;

using FinTech.Modules.Identity.Domain.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.SharedKernel.Contracts;
using MediatR;
using Microsoft.Extensions.Logging;

public sealed class UserPasswordChangedEventHandler : INotificationHandler<UserPasswordChangedEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly INotificationSender _sender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<UserPasswordChangedEventHandler> _logger;

    public UserPasswordChangedEventHandler(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        INotificationSender sender,
        IIdentityService identityService,
        ILogger<UserPasswordChangedEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _sender = sender;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Handle(UserPasswordChangedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling UserPasswordChangedEvent for user {UserId}",
            notification.UserId);

        try
        {

            var preferences = await _preferenceRepository.GetByUserIdAsync(notification.UserId, cancellationToken);
            if (preferences == null || !preferences.SecurityAlerts)
            {
                _logger.LogInformation(
                    "Security alerts disabled for user {UserId}, skipping password change notification",
                    notification.UserId);
                return;
            }

var userInfoResult = await _identityService.GetUserInfoAsync(notification.UserId, cancellationToken);
            if (userInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get user info for {UserId}: {Error}",
                    notification.UserId,
                    userInfoResult.Error.Message);
                return;
            }

var securityNotification = Domain.Entities.Notification.Create(
                notification.UserId,
                NotificationType.Email,
                NotificationCategory.Security,
                "Password Changed - Security Alert",
                $"Your password was changed on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC. If you did not make this change, please contact support immediately.",
                userInfoResult.Value!.Email,
                notification.UserId.Value,
                "User");

            if (securityNotification.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to create security notification for user {UserId}: {Error}",
                    notification.UserId,
                    securityNotification.Error.Message);
                return;
            }

            await _notificationRepository.AddAsync(securityNotification.Value!, cancellationToken);
            await _notificationRepository.SaveChangesAsync(cancellationToken);

var sendResult = await _sender.SendAsync(securityNotification.Value!, cancellationToken);

            if (sendResult.IsSuccess)
            {
                securityNotification.Value!.MarkAsSent();
            }
            else
            {
                securityNotification.Value!.MarkAsFailed(sendResult.Error.Message);
            }

            await _notificationRepository.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error handling UserPasswordChangedEvent for user {UserId}",
                notification.UserId);
        }
    }
}