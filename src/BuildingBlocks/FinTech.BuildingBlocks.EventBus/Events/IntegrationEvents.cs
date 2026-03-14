namespace FinTech.BuildingBlocks.EventBus.Events;

public sealed record UserCreatedIntegrationEvent(
    Guid UserId,
    string Email,
    string? FirstName,
    string? LastName) : IntegrationEventBase;

public sealed record TransactionCompletedIntegrationEvent(
    Guid TransactionId,
    Guid SourceWalletId,
    Guid? DestinationWalletId,
    decimal Amount,
    string Currency,
    string TransactionType) : IntegrationEventBase;

public sealed record TransactionFailedIntegrationEvent(
    Guid TransactionId,
    Guid WalletId,
    decimal Amount,
    string Currency,
    string Reason) : IntegrationEventBase;

public sealed record WalletCreatedIntegrationEvent(
    Guid WalletId,
    Guid UserId,
    string WalletName,
    string Currency) : IntegrationEventBase;

public sealed record BalanceChangedIntegrationEvent(
    Guid WalletId,
    decimal NewBalance,
    string Currency) : IntegrationEventBase;

public sealed record SendEmailIntegrationEvent(
    Guid UserId,
    string To,
    string Subject,
    string Body) : IntegrationEventBase;

public sealed record SendPushNotificationIntegrationEvent(
    Guid UserId,
    string Title,
    string Body) : IntegrationEventBase;
