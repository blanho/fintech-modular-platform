using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Application.Consumers;

public sealed class WalletCreatedIntegrationEventConsumer : IConsumer<WalletCreatedIntegrationEvent>
{
    private readonly IEmailSender _emailSender;
    private readonly IIdentityService _identityService;
    private readonly ILogger<WalletCreatedIntegrationEventConsumer> _logger;
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationPreferenceRepository _preferenceRepository;

    public WalletCreatedIntegrationEventConsumer(
        INotificationRepository notificationRepository,
        INotificationPreferenceRepository preferenceRepository,
        IEmailSender emailSender,
        IIdentityService identityService,
        ILogger<WalletCreatedIntegrationEventConsumer> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _emailSender = emailSender;
        _identityService = identityService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<WalletCreatedIntegrationEvent> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Consuming WalletCreatedIntegrationEvent for wallet {WalletId}, CorrelationId: {CorrelationId}",
            message.WalletId,
            message.CorrelationId);

        try
        {
            var userId = new UserId(message.UserId);

            var preferences = await _preferenceRepository.GetByUserIdAsync(userId, context.CancellationToken);
            if (preferences != null && !preferences.EmailEnabled)
            {
                _logger.LogInformation(
                    "Email notifications disabled for user {UserId}, skipping wallet creation notification",
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
            var subject = $"New {message.Currency} Wallet Created";
            var body = $"""
                        Hello {userInfo.FirstName ?? userInfo.Email},

                        Your new {message.Currency} wallet "{message.WalletName}" has been created successfully.

                        Wallet ID: {message.WalletId}

                        You can now start making deposits and transfers with this wallet.

                        Best regards,
                        The FinTech Team
                        """;

            var notificationResult = Domain.Entities.Notification.Create(
                userId,
                NotificationType.Email,
                NotificationCategory.Account,
                subject,
                body,
                userInfo.Email,
                message.WalletId,
                "Wallet");

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
                "Error processing WalletCreatedIntegrationEvent for wallet {WalletId}",
                message.WalletId);
            throw;
        }
    }
}