namespace FinTech.BuildingBlocks.EventBus.Events;

public sealed record UserCreatedIntegrationEvent(
    Guid UserId,
    string Email,
    string? FirstName,
    string? LastName) : IntegrationEventBase;

public sealed record UserPasswordChangedIntegrationEvent(
    Guid UserId) : IntegrationEventBase;

public sealed record TransactionCompletedIntegrationEvent(
    Guid TransactionId,
    Guid SourceWalletId,
    Guid? DestinationWalletId,
    decimal Amount,
    string Currency,
    string TransactionType,
    DateTime CompletedAt) : IntegrationEventBase;

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
    decimal PreviousBalance,
    decimal NewBalance,
    decimal ChangeAmount,
    string ChangeType,
    string Currency) : IntegrationEventBase;

public sealed record SendEmailIntegrationEvent(
    Guid UserId,
    string ToEmail,
    string Subject,
    string Body) : IntegrationEventBase;

public sealed record SendPushNotificationIntegrationEvent(
    Guid UserId,
    string Title,
    string Body) : IntegrationEventBase;

public sealed record AuditRequestedIntegrationEvent(
    Guid? UserId,
    string Action,
    string ResourceType,
    string? ResourceId,
    bool IsSuccess,
    string? ErrorMessage,
    long DurationMs,
    string? IpAddress,
    string? UserAgent) : IntegrationEventBase;