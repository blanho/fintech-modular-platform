using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Transaction.Domain.Enums;
using FinTech.Modules.Transaction.Domain.Events;

namespace FinTech.Modules.Transaction.Domain.Entities;

public sealed class Transaction : AggregateRoot<TransactionId>
{
    private Transaction()
    {
    }

    public TransactionType Type { get; private set; }
    public TransactionStatus Status { get; private set; }
    public Money Amount { get; private set; } = null!;
    public WalletId SourceWalletId { get; private set; }
    public WalletId? TargetWalletId { get; private set; }
    public string? Description { get; private set; }
    public string IdempotencyKey { get; private set; } = null!;
    public string? FailureReason { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    public static Result<Transaction> CreateTransfer(
        WalletId sourceWalletId,
        WalletId targetWalletId,
        Money amount,
        string? description = null,
        string? idempotencyKey = null)
    {
        if (sourceWalletId.IsEmpty)
            return Result<Transaction>.Failure(Error.Validation("Source wallet is required"));

        if (targetWalletId.IsEmpty)
            return Result<Transaction>.Failure(Error.Validation("Target wallet is required"));

        if (sourceWalletId == targetWalletId)
            return Result<Transaction>.Failure(Error.Validation("Cannot transfer to the same wallet"));

        if (!amount.IsPositive)
            return Result<Transaction>.Failure(Error.Validation("Transfer amount must be positive"));

        var transaction = new Transaction
        {
            Id = TransactionId.New(),
            Type = TransactionType.Transfer,
            Status = TransactionStatus.Pending,
            Amount = amount,
            SourceWalletId = sourceWalletId,
            TargetWalletId = targetWalletId,
            Description = description?.Trim(),
            IdempotencyKey = idempotencyKey ?? Guid.NewGuid().ToString(),
            CreatedAt = DateTime.UtcNow
        };

        transaction.RaiseDomainEvent(new TransactionCreatedEvent(
            transaction.Id,
            transaction.Type,
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId,
            transaction.TargetWalletId,
            transaction.IdempotencyKey));

        return Result<Transaction>.Success(transaction);
    }

    public static Result<Transaction> CreateDeposit(
        WalletId walletId,
        Money amount,
        string? description = null,
        string? idempotencyKey = null)
    {
        if (walletId.IsEmpty)
            return Result<Transaction>.Failure(Error.Validation("Wallet is required"));

        if (!amount.IsPositive)
            return Result<Transaction>.Failure(Error.Validation("Deposit amount must be positive"));

        var transaction = new Transaction
        {
            Id = TransactionId.New(),
            Type = TransactionType.Deposit,
            Status = TransactionStatus.Pending,
            Amount = amount,
            SourceWalletId = walletId,
            TargetWalletId = null,
            Description = description?.Trim(),
            IdempotencyKey = idempotencyKey ?? Guid.NewGuid().ToString(),
            CreatedAt = DateTime.UtcNow
        };

        transaction.RaiseDomainEvent(new TransactionCreatedEvent(
            transaction.Id,
            transaction.Type,
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId,
            null,
            transaction.IdempotencyKey));

        return Result<Transaction>.Success(transaction);
    }

    public static Result<Transaction> CreateWithdrawal(
        WalletId walletId,
        Money amount,
        string? description = null,
        string? idempotencyKey = null)
    {
        if (walletId.IsEmpty)
            return Result<Transaction>.Failure(Error.Validation("Wallet is required"));

        if (!amount.IsPositive)
            return Result<Transaction>.Failure(Error.Validation("Withdrawal amount must be positive"));

        var transaction = new Transaction
        {
            Id = TransactionId.New(),
            Type = TransactionType.Withdrawal,
            Status = TransactionStatus.Pending,
            Amount = amount,
            SourceWalletId = walletId,
            TargetWalletId = null,
            Description = description?.Trim(),
            IdempotencyKey = idempotencyKey ?? Guid.NewGuid().ToString(),
            CreatedAt = DateTime.UtcNow
        };

        transaction.RaiseDomainEvent(new TransactionCreatedEvent(
            transaction.Id,
            transaction.Type,
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId,
            null,
            transaction.IdempotencyKey));

        return Result<Transaction>.Success(transaction);
    }

    public Result Complete()
    {
        if (Status != TransactionStatus.Pending)
            return Result.Failure(Error.Conflict($"Cannot complete transaction in {Status} status"));

        Status = TransactionStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TransactionCompletedEvent(
            Id,
            SourceWalletId,
            TargetWalletId,
            Amount.Amount,
            Amount.Currency.Code,
            CompletedAt.Value));

        return Result.Success();
    }

    public Result Fail(string reason)
    {
        if (Status != TransactionStatus.Pending)
            return Result.Failure(Error.Conflict($"Cannot fail transaction in {Status} status"));

        if (string.IsNullOrWhiteSpace(reason))
            return Result.Failure(Error.Validation("Failure reason is required"));

        Status = TransactionStatus.Failed;
        FailureReason = reason.Trim();
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new TransactionFailedEvent(Id, SourceWalletId, FailureReason));

        return Result.Success();
    }

    public WalletId? GetCreditWalletId()
    {
        return Type switch
        {
            TransactionType.Deposit => SourceWalletId,
            TransactionType.Transfer => TargetWalletId,
            TransactionType.Withdrawal => null,
            _ => null
        };
    }

    public WalletId? GetDebitWalletId()
    {
        return Type switch
        {
            TransactionType.Deposit => null,
            TransactionType.Transfer => SourceWalletId,
            TransactionType.Withdrawal => SourceWalletId,
            _ => null
        };
    }
}