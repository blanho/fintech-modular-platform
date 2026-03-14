namespace FinTech.Modules.Notification.Application.EventHandlers;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Transaction.Domain.Events;
using FinTech.SharedKernel.Contracts;
using MediatR;
using Microsoft.Extensions.Logging;

public sealed class TransactionCompletedEventHandler : INotificationHandler<TransactionCompletedEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly INotificationSender _sender;
    private readonly IWalletService _walletService;
    private readonly IIdentityService _identityService;
    private readonly ILogger<TransactionCompletedEventHandler> _logger;

    public TransactionCompletedEventHandler(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        INotificationSender sender,
        IWalletService walletService,
        IIdentityService identityService,
        ILogger<TransactionCompletedEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _sender = sender;
        _walletService = walletService;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Handle(TransactionCompletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling TransactionCompletedEvent for transaction {TransactionId}",
            notification.TransactionId);

        try
        {

            var walletInfoResult = await _walletService.GetWalletInfoAsync(notification.SourceWalletId, cancellationToken);
            if (walletInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get wallet info for {WalletId}: {Error}",
                    notification.SourceWalletId,
                    walletInfoResult.Error.Message);
                return;
            }

            var userId = walletInfoResult.Value!.UserId;

var preferences = await _preferenceRepository.GetByUserIdAsync(userId, cancellationToken);
            if (preferences == null || !preferences.TransactionAlerts)
            {
                _logger.LogInformation(
                    "Transaction alerts disabled for user {UserId}, skipping notification",
                    userId);
                return;
            }

var userInfoResult = await _identityService.GetUserInfoAsync(userId, cancellationToken);
            if (userInfoResult.IsFailure)
            {
                _logger.LogWarning(
                    "Could not get user info for {UserId}: {Error}",
                    userId,
                    userInfoResult.Error.Message);
                return;
            }

var transactionType = notification.TargetWalletId.HasValue ? "Transfer" : "Transaction";
            var subject = $"{transactionType} Completed - {notification.Amount:F2} {notification.Currency}";
            var body = $"Your {transactionType.ToLower()} of {notification.Amount:F4} {notification.Currency} was completed successfully on {notification.CompletedAt:yyyy-MM-dd HH:mm} UTC.\n\nTransaction ID: {notification.TransactionId}";

var txNotification = Domain.Entities.Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Transaction,
                subject,
                body,
                userInfoResult.Value!.Email,
                notification.TransactionId.Value,
                "Transaction");

            if (txNotification.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to create transaction notification: {Error}",
                    txNotification.Error.Message);
                return;
            }

            await _notificationRepository.AddAsync(txNotification.Value!, cancellationToken);
            await _notificationRepository.SaveChangesAsync(cancellationToken);

var sendResult = await _sender.SendAsync(txNotification.Value!, cancellationToken);

            if (sendResult.IsSuccess)
            {
                txNotification.Value!.MarkAsSent();
            }
            else
            {
                txNotification.Value!.MarkAsFailed(sendResult.Error.Message);
            }

            await _notificationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Transaction notification {NotificationId} {Status} for transaction {TransactionId}",
                txNotification.Value!.Id,
                sendResult.IsSuccess ? "sent" : "failed",
                notification.TransactionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error handling TransactionCompletedEvent for transaction {TransactionId}",
                notification.TransactionId);
        }
    }
}