namespace FinTech.Infrastructure.Messaging;

public record SendEmailIntegrationEvent : IntegrationEventBase
{
    public Guid UserId { get; init; }
    public string ToEmail { get; init; } = default!;
    public string Subject { get; init; } = default!;
    public string Body { get; init; } = default!;
    public bool IsHtml { get; init; }
    public string? TemplateName { get; init; }
    public Dictionary<string, string>? TemplateData { get; init; }

    public SendEmailIntegrationEvent() { }

    public SendEmailIntegrationEvent(
        Guid userId,
        string toEmail,
        string subject,
        string body,
        bool isHtml = false)
    {
        UserId = userId;
        ToEmail = toEmail;
        Subject = subject;
        Body = body;
        IsHtml = isHtml;
    }
}

public record SendPushNotificationIntegrationEvent : IntegrationEventBase
{
    public Guid UserId { get; init; }
    public string Title { get; init; } = default!;
    public string Message { get; init; } = default!;
    public Dictionary<string, string>? Data { get; init; }

    public SendPushNotificationIntegrationEvent() { }

    public SendPushNotificationIntegrationEvent(Guid userId, string title, string message)
    {
        UserId = userId;
        Title = title;
        Message = message;
    }
}

public record UserCreatedIntegrationEvent : IntegrationEventBase
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = default!;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }

    public UserCreatedIntegrationEvent() { }

    public UserCreatedIntegrationEvent(Guid userId, string email, string? firstName = null, string? lastName = null)
    {
        UserId = userId;
        Email = email;
        FirstName = firstName;
        LastName = lastName;
    }
}

public record TransactionCompletedIntegrationEvent : IntegrationEventBase
{
    public Guid TransactionId { get; init; }
    public Guid SourceWalletId { get; init; }
    public Guid? TargetWalletId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = default!;
    public string TransactionType { get; init; } = default!;
    public DateTime CompletedAt { get; init; }
    public string? Description { get; init; }

    public TransactionCompletedIntegrationEvent() { }

    public TransactionCompletedIntegrationEvent(
        Guid transactionId,
        Guid sourceWalletId,
        Guid? targetWalletId,
        decimal amount,
        string currency,
        string transactionType,
        DateTime completedAt,
        string? description = null)
    {
        TransactionId = transactionId;
        SourceWalletId = sourceWalletId;
        TargetWalletId = targetWalletId;
        Amount = amount;
        Currency = currency;
        TransactionType = transactionType;
        CompletedAt = completedAt;
        Description = description;
    }
}

public record TransactionFailedIntegrationEvent : IntegrationEventBase
{
    public Guid TransactionId { get; init; }
    public Guid SourceWalletId { get; init; }
    public Guid? TargetWalletId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = default!;
    public string TransactionType { get; init; } = default!;
    public string FailureReason { get; init; } = default!;

    public TransactionFailedIntegrationEvent() { }

    public TransactionFailedIntegrationEvent(
        Guid transactionId,
        Guid sourceWalletId,
        Guid? targetWalletId,
        decimal amount,
        string currency,
        string transactionType,
        string failureReason)
    {
        TransactionId = transactionId;
        SourceWalletId = sourceWalletId;
        TargetWalletId = targetWalletId;
        Amount = amount;
        Currency = currency;
        TransactionType = transactionType;
        FailureReason = failureReason;
    }
}

public record WalletCreatedIntegrationEvent : IntegrationEventBase
{
    public Guid WalletId { get; init; }
    public Guid UserId { get; init; }
    public string Currency { get; init; } = default!;
    public string WalletName { get; init; } = default!;

    public WalletCreatedIntegrationEvent() { }

    public WalletCreatedIntegrationEvent(Guid walletId, Guid userId, string currency, string walletName)
    {
        WalletId = walletId;
        UserId = userId;
        Currency = currency;
        WalletName = walletName;
    }
}

public record BalanceChangedIntegrationEvent : IntegrationEventBase
{
    public Guid WalletId { get; init; }
    public Guid TransactionId { get; init; }
    public decimal PreviousBalance { get; init; }
    public decimal NewBalance { get; init; }
    public decimal ChangeAmount { get; init; }
    public string ChangeType { get; init; } = default!;
    public string Currency { get; init; } = default!;

    public BalanceChangedIntegrationEvent() { }

    public BalanceChangedIntegrationEvent(
        Guid walletId,
        Guid transactionId,
        decimal previousBalance,
        decimal newBalance,
        decimal changeAmount,
        string changeType,
        string currency)
    {
        WalletId = walletId;
        TransactionId = transactionId;
        PreviousBalance = previousBalance;
        NewBalance = newBalance;
        ChangeAmount = changeAmount;
        ChangeType = changeType;
        Currency = currency;
    }
}