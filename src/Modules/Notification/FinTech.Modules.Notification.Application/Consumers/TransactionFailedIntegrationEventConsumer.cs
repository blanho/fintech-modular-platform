using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Application.Consumers;

public sealed class TransactionFailedIntegrationEventConsumer : IConsumer<TransactionFailedIntegrationEvent>
{
    private readonly IEmailSender _emailSender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<TransactionFailedIntegrationEventConsumer> _logger;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly IWalletService _walletService;

    public TransactionFailedIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        IEmailSender emailSender,
        IWalletService walletService,
        IIdentityService identityService,
        ILogger<TransactionFailedIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _emailSender = emailSender;
        _walletService = walletService;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<TransactionFailedIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming TransactionFailedIntegrationEvent for transaction {TransactionId}: {Reason}, CorrelationId: {CorrelationId}",
            message.TransactionId,
            message.Reason,
            message.CorrelationId);

        try
        {
            var walletId = new WalletId(message.WalletId);
            var walletInfoResult = await _walletService.GetWalletInfoAsync(walletId, context.CancellationToken);
            if (walletInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get wallet info for {WalletId}: {Error}",
                    message.WalletId,
                    walletInfoResult.Error.Message);
                return;
            }

            var userId = walletInfoResult.Value!.UserId;

            var preferences = await _preferenceRepository.GetByUserIdAsync(userId, context.CancellationToken);
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
            var subject = "Transaction Failed";
            var body = $"""
                        Hello {userInfo.FirstName ?? userInfo.Email},

                        Your transaction could not be completed.

                        Transaction Details:
                        - Transaction ID: {message.TransactionId}
                        - Amount: {message.Currency} {message.Amount:F4}
                        - Reason: {message.Reason}

                        Please try again or contact support if the issue persists.

                        Best regards,
                        FinTech Team
                        """;

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
                "Error processing TransactionFailedIntegrationEvent for transaction {TransactionId}",
                message.TransactionId);
            throw;
        }
    }
}
