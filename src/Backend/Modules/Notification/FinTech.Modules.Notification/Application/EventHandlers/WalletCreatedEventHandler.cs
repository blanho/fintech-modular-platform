namespace FinTech.Modules.Notification.Application.EventHandlers;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Wallet.Domain.Events;
using FinTech.SharedKernel.Contracts;
using MediatR;
using Microsoft.Extensions.Logging;

public sealed class WalletCreatedEventHandler : INotificationHandler<WalletCreatedEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;
    private readonly INotificationSender _sender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<WalletCreatedEventHandler> _logger;

    public WalletCreatedEventHandler(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        INotificationSender sender,
        IIdentityService identityService,
        ILogger<WalletCreatedEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _sender = sender;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Handle(WalletCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Handling WalletCreatedEvent for wallet {WalletId} (user {UserId})",
            notification.WalletId,
            notification.UserId);

        try
        {

            var preferences = await _preferenceRepository.GetByUserIdAsync(notification.UserId, cancellationToken);
            if (preferences == null || !preferences.EmailEnabled)
            {
                _logger.LogInformation(
                    "Email notifications disabled for user {UserId}, skipping wallet creation notification",
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

var subject = $"New {notification.Currency} Wallet Created";
            var body = $"Your new {notification.Currency} wallet has been created successfully.\n\nWallet ID: {notification.WalletId}\n\nYou can now start making deposits and transfers with this wallet.";

var walletNotification = Domain.Entities.Notification.Create(
                notification.UserId,
                NotificationType.Email,
                NotificationCategory.Account,
                subject,
                body,
                userInfoResult.Value!.Email,
                notification.WalletId.Value,
                "Wallet");

            if (walletNotification.IsFailure)
            {
                _logger.LogWarning(
                    "Failed to create wallet notification: {Error}",
                    walletNotification.Error.Message);
                return;
            }

            await _notificationRepository.AddAsync(walletNotification.Value!, cancellationToken);
            await _notificationRepository.SaveChangesAsync(cancellationToken);

var sendResult = await _sender.SendAsync(walletNotification.Value!, cancellationToken);

            if (sendResult.IsSuccess)
            {
                walletNotification.Value!.MarkAsSent();
            }
            else
            {
                walletNotification.Value!.MarkAsFailed(sendResult.Error.Message);
            }

            await _notificationRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Wallet creation notification {NotificationId} {Status} for wallet {WalletId}",
                walletNotification.Value!.Id,
                sendResult.IsSuccess ? "sent" : "failed",
                notification.WalletId);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error handling WalletCreatedEvent for wallet {WalletId}",
                notification.WalletId);
        }
    }
}