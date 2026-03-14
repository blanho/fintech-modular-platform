namespace FinTech.Modules.Notification.Application.Consumers;

using FinTech.Infrastructure.Messaging;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.SharedKernel.Primitives;
using MassTransit;
using Microsoft.Extensions.Logging;

public sealed class SendEmailIntegrationEventConsumer : IConsumer<SendEmailIntegrationEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<SendEmailIntegrationEventConsumer> _logger;

    public SendEmailIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        IEmailSender emailSender,
        ILogger<SendEmailIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<SendEmailIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming SendEmailIntegrationEvent for {ToEmail}, Subject: {Subject}, CorrelationId: {CorrelationId}",
            message.ToEmail,
            message.Subject,
            message.CorrelationId);

        try
        {
            var userId = new UserId(message.UserId);

var notificationResult = Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Marketing,
                message.Subject,
                message.Body,
                message.ToEmail,
                null,
                "Email");

            if (notificationResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not create notification: {Error}",
                    notificationResult.Error.Message);
                return;
            }

            var notification = notificationResult.Value!;

var sendResult = await _emailSender.SendAsync(
                message.ToEmail,
                message.Subject,
                message.Body,
                context.CancellationToken);

            if (sendResult.IsSuccess)
            {
                notification.MarkAsSent();
                _logger.LogInformation(
                    "Email sent successfully to {ToEmail}",
                    message.ToEmail);
            }
            else
            {
                notification.MarkAsFailed(sendResult.Error.Message);
                _logger.LogWarning(
                    "Email delivery failed for {ToEmail}: {Error}",
                    message.ToEmail,
                    sendResult.Error.Message);
            }

await _notificationRepository.AddAsync(notification, context.CancellationToken);
            await _notificationRepository.SaveChangesAsync(context.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error sending email to {ToEmail}",
                message.ToEmail);
            throw;
        }
    }
}

public sealed class UserCreatedIntegrationEventConsumer : IConsumer<UserCreatedIntegrationEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<UserCreatedIntegrationEventConsumer> _logger;

    public UserCreatedIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        IEmailSender emailSender,
        ILogger<UserCreatedIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _emailSender = emailSender;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserCreatedIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming UserCreatedIntegrationEvent for user {UserId}, Email: {Email}, CorrelationId: {CorrelationId}",
            message.UserId,
            message.Email,
            message.CorrelationId);

        try
        {
            var userId = new UserId(message.UserId);

var existingPrefs = await _preferenceRepository.GetByUserIdAsync(userId, context.CancellationToken);
            if (existingPrefs == null)
            {
                var prefsResult = NotificationPreference.CreateDefault(userId);
                if (prefsResult.IsSuccess)
                {
                    await _preferenceRepository.AddAsync(prefsResult.Value!, context.CancellationToken);
                    await _preferenceRepository.SaveChangesAsync(context.CancellationToken);
                    _logger.LogInformation(
                        "Created default notification preferences for user {UserId}",
                        message.UserId);
                }
            }

var subject = "Welcome to FinTech Platform!";
            var body = FormatWelcomeEmail(message.FirstName ?? message.Email);

            var notificationResult = Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Transaction,
                subject,
                body,
                message.Email,
                null,
                "Welcome");

            if (notificationResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not create notification: {Error}",
                    notificationResult.Error.Message);
                return;
            }

            var notification = notificationResult.Value!;

            var sendResult = await _emailSender.SendAsync(
                message.Email,
                subject,
                body,
                context.CancellationToken);

            if (sendResult.IsSuccess)
            {
                notification.MarkAsSent();
                _logger.LogInformation(
                    "Welcome email sent successfully to {Email}",
                    message.Email);
            }
            else
            {
                notification.MarkAsFailed(sendResult.Error.Message);
                _logger.LogWarning(
                    "Welcome email delivery failed for {Email}: {Error}",
                    message.Email,
                    sendResult.Error.Message);
            }

            await _notificationRepository.AddAsync(notification, context.CancellationToken);
            await _notificationRepository.SaveChangesAsync(context.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing UserCreatedIntegrationEvent for user {UserId}",
                message.UserId);
            throw;
        }
    }

    private static string FormatWelcomeEmail(string recipientName)
    {
        return $"""
            Hello {recipientName},

            Welcome to FinTech Platform!

            Your account has been created successfully. You can now:
            - Create wallets in multiple currencies
            - Transfer money between wallets
            - Deposit and withdraw funds
            - View your complete transaction history

            If you have any questions, please don't hesitate to contact our support team.

            Best regards,
            The FinTech Team
            """;
    }
}

public sealed class BalanceChangedIntegrationEventConsumer : IConsumer<BalanceChangedIntegrationEvent>
{
    private readonly ILogger<BalanceChangedIntegrationEventConsumer> _logger;

    public BalanceChangedIntegrationEventConsumer(
        ILogger<BalanceChangedIntegrationEventConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<BalanceChangedIntegrationEvent> context)
    {
        var message = context.Message;

_logger.LogInformation(
            "Balance changed for wallet {WalletId}: Previous={PreviousBalance}, New={NewBalance}, Change={ChangeAmount} ({ChangeType}), CorrelationId: {CorrelationId}",
            message.WalletId,
            message.PreviousBalance,
            message.NewBalance,
            message.ChangeAmount,
            message.ChangeType,
            message.CorrelationId);

        return Task.CompletedTask;
    }
}