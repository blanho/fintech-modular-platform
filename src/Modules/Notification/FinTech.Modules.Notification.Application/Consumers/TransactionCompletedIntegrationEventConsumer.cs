using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Application.Consumers;

public sealed class TransactionCompletedIntegrationEventConsumer : IConsumer<TransactionCompletedIntegrationEvent>
{
    private readonly IEmailSender _emailSender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<TransactionCompletedIntegrationEventConsumer> _logger;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly IWalletService _walletService;

    public TransactionCompletedIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        IEmailSender emailSender,
        IWalletService walletService,
        IIdentityService identityService,
        ILogger<TransactionCompletedIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _emailSender = emailSender;
        _walletService = walletService;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<TransactionCompletedIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming TransactionCompletedIntegrationEvent for transaction {TransactionId}, CorrelationId: {CorrelationId}",
            message.TransactionId,
            message.CorrelationId);

        try
        {
            var sourceWalletId = new WalletId(message.SourceWalletId);
            var walletInfoResult = await _walletService.GetWalletInfoAsync(sourceWalletId, context.CancellationToken);
            if (walletInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get wallet info for {WalletId}: {Error}",
                    message.SourceWalletId,
                    walletInfoResult.Error.Message);
                return;
            }

            var userId = walletInfoResult.Value!.UserId;

            var preferences = await _preferenceRepository.GetByUserIdAsync(userId, context.CancellationToken);
            if (preferences == null)
                _logger.LogInformation(
                    "No notification preferences found for user {UserId}, using defaults",
                    userId);

            if (preferences != null && !preferences.TransactionAlerts)
            {
                _logger.LogInformation(
                    "Transaction alerts disabled for user {UserId}, skipping notification",
                    userId);
                return;
            }

            var userInfoResult = await _identityService.GetUserInfoAsync(userId, context.CancellationToken);
            if (userInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get user info for {UserId}: {Error}",
                    userId,
                    userInfoResult.Error.Message);
                return;
            }

            var userInfo = userInfoResult.Value!;

            var subject = $"Transaction Completed - {message.Currency} {message.Amount:F4}";
            var body = FormatTransactionEmail(message, userInfo.FirstName ?? userInfo.Email);

            var notificationResult = Domain.Entities.Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Transaction,
                subject,
                body,
                userInfo.Email,
                message.TransactionId,
                "Transaction");

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
            {
                notification.MarkAsSent();
                _logger.LogInformation(
                    "Transaction notification sent successfully to {Email}",
                    userInfo.Email);
            }
            else
            {
                notification.MarkAsFailed(sendResult.Error.Message);
                _logger.LogWarning(
                    "Failed to send notification to {Email}: {Error}",
                    userInfo.Email,
                    sendResult.Error.Message);
            }

            await _notificationRepository.AddAsync(notification, context.CancellationToken);
            await _notificationRepository.SaveChangesAsync(context.CancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing TransactionCompletedIntegrationEvent for transaction {TransactionId}",
                message.TransactionId);
            throw;
        }
    }

    private static string FormatTransactionEmail(TransactionCompletedIntegrationEvent message, string recipientName)
    {
        return $"""
                Hello {recipientName},

                Your {message.TransactionType.ToLowerInvariant()} transaction has been completed successfully.

                Transaction Details:
                - Transaction ID: {message.TransactionId}
                - Type: {message.TransactionType}
                - Amount: {message.Currency} {message.Amount:F4}
                - Completed At: {message.CompletedAt:yyyy-MM-dd HH:mm:ss} UTC

                Thank you for using FinTech Platform.

                Best regards,
                FinTech Team
                """;
    }
}
