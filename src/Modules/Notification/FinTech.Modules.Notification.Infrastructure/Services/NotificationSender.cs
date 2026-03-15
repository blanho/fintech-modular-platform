using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Infrastructure.Services;

public class NotificationSender : INotificationSender
{
    private readonly IEmailSender _emailSender;
    private readonly ILogger<NotificationSender> _logger;
    private readonly IPushNotificationSender _pushSender;
    private readonly ISmsSender _smsSender;

    public NotificationSender(
        IEmailSender emailSender,
        IPushNotificationSender pushSender,
        ISmsSender smsSender,
        ILogger<NotificationSender> logger)
    {
        _emailSender = emailSender;
        _pushSender = pushSender;
        _smsSender = smsSender;
        _logger = logger;
    }

    public async Task<Result> SendAsync(Domain.Entities.Notification notification, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Sending {Type} notification {NotificationId} to user {UserId}",
            notification.Type,
            notification.Id,
            notification.UserId);

        return notification.Type switch
        {
            NotificationType.Email => await SendEmailAsync(notification, ct),
            NotificationType.Push => await SendPushAsync(notification, ct),
            NotificationType.Sms => await SendSmsAsync(notification, ct),
            NotificationType.InApp => Result.Success(),
            _ => Result.Failure(Error.Validation($"Unsupported notification type: {notification.Type}"))
        };
    }

    private async Task<Result> SendEmailAsync(Domain.Entities.Notification notification, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(notification.Recipient))
            return Result.Failure(Error.Validation("Email recipient is required"));

        return await _emailSender.SendAsync(
            notification.Recipient,
            notification.Subject,
            notification.Body,
            ct);
    }

    private async Task<Result> SendPushAsync(Domain.Entities.Notification notification, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(notification.Recipient))
            return Result.Failure(Error.Validation("Device token is required for push notification"));

        return await _pushSender.SendAsync(
            notification.Recipient,
            notification.Subject,
            notification.Body,
            ct);
    }

    private async Task<Result> SendSmsAsync(Domain.Entities.Notification notification, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(notification.Recipient))
            return Result.Failure(Error.Validation("Phone number is required for SMS"));

        return await _smsSender.SendAsync(
            notification.Recipient,
            notification.Body,
            ct);
    }
}
