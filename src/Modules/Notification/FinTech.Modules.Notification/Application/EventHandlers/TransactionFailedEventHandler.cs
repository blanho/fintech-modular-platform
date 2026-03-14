namespace FinTech.Modules.Notification.Application.EventHandlers;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Transaction.Domain.Events;
using FinTech.SharedKernel.Contracts;
using MediatR;
using Microsoft.Extensions.Logging;

public sealed class TransactionFailedEventHandler : INotificationHandler<TransactionFailedEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly INotificationSender _sender;
    private readonly IWalletService _walletService;
    private readonly IIdentityService _identityService;
    private readonly ILogger<TransactionFailedEventHandler> _logger;

    public TransactionFailedEventHandler(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        INotificationSender sender,
        IWalletService walletService,
        IIdentityService identityService,
        ILogger<TransactionFailedEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _sender = sender;
        _walletService = walletService;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Handle(TransactionFailedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling TransactionFailedEvent for transaction {TransactionId}: {Reason}",
            notification.TransactionId,
            notification.Reason);

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

var subject = "Transaction Failed";
            var body = $"Your transaction could not be completed.\n\nReason: {notification.Reason}\n\nTransaction ID: {notification.TransactionId}\n\nPlease try again or contact support if the issue persists.";

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
                    "Failed to create transaction failed notification: {Error}",
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
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error handling TransactionFailedEvent for transaction {TransactionId}",
                notification.TransactionId);
        }
    }
}