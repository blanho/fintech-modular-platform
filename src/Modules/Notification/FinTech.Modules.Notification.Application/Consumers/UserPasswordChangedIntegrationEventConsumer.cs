using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Application.Consumers;

public sealed class UserPasswordChangedIntegrationEventConsumer : IConsumer<UserPasswordChangedIntegrationEvent>
{
    private readonly IEmailSender _emailSender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<UserPasswordChangedIntegrationEventConsumer> _logger;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;

    public UserPasswordChangedIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        IEmailSender emailSender,
        IIdentityService identityService,
        ILogger<UserPasswordChangedIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _emailSender = emailSender;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserPasswordChangedIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming UserPasswordChangedIntegrationEvent for user {UserId}, CorrelationId: {CorrelationId}",
            message.UserId,
            message.CorrelationId);

        try
        {
            var userId = new UserId(message.UserId);

            var preferences = await _preferenceRepository.GetByUserIdAsync(userId, context.CancellationToken);
            if (preferences != null && !preferences.SecurityAlerts)
            {
                _logger.LogInformation(
                    "Security alerts disabled for user {UserId}, skipping password change notification",
                    message.UserId);
                return;
            }

            var userInfoResult = await _identityService.GetUserInfoAsync(userId, context.CancellationToken);
            if (userInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get user info for {UserId}: {Error}",
                    message.UserId,
                    userInfoResult.Error.Message);
                return;
            }

            var userInfo = userInfoResult.Value!;
            var subject = "Password Changed - Security Alert";
            var body = $"""
                        Hello {userInfo.FirstName ?? userInfo.Email},

                        Your password was changed on {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC.

                        If you did not make this change, please contact support immediately.

                        Best regards,
                        The FinTech Team
                        """;

            var notificationResult = Domain.Entities.Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Security,
                subject,
                body,
                userInfo.Email,
                message.UserId,
                "User");

            if (notificationResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not create notification: {Error}",
                    notificationResult.Error.Message);
                return;
            }

            var notification = notificationResult.Value!;

            var sendResult = await _emailSender.SendAsync(
                userInfo.Email,
                subject,
                body,
                context.CancellationToken);

            if (sendResult.IsSuccess)
                notification.MarkAsSent();
            else
                notification.MarkAsFailed(sendResult.Error.Message);

            await _notificationRepository.AddAsync(notification, context.CancellationToken);
            await _notificationRepository.SaveChangesAsync(context.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing UserPasswordChangedIntegrationEvent for user {UserId}",
                message.UserId);
            throw;
        }
    }
}
