using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Ledger.Domain.Enums;
using FinTech.Modules.Ledger.Domain.Events;

namespace FinTech.Modules.Ledger.Domain.Entities;

public sealed class LedgerEntry : Entity<LedgerEntryId>
{
    private LedgerEntry()
    {
    }

    public WalletId WalletId { get; private set; }

    public decimal Amount { get; private set; }

    public string Currency { get; private set; } = null!;

    public TransactionId ReferenceId { get; private set; }

    public LedgerEntryType EntryType { get; private set; }

    public string? Description { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public static Result<LedgerEntry> CreateCredit(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description = null)
    {
        if (amount.Amount <= 0)
            return Result<LedgerEntry>.Failure(Error.Validation("Credit amount must be positive"));

        return CreateEntry(walletId, amount.Amount, amount.Currency.Code, referenceId, LedgerEntryType.Credit,
            description);
    }

    public static Result<LedgerEntry> CreateDebit(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description = null)
    {
        if (amount.Amount <= 0)
            return Result<LedgerEntry>.Failure(Error.Validation("Debit amount must be positive"));

        var negativeAmount = -Math.Abs(amount.Amount);

        return CreateEntry(walletId, negativeAmount, amount.Currency.Code, referenceId, LedgerEntryType.Debit,
            description);
    }

    private static Result<LedgerEntry> CreateEntry(
        WalletId walletId,
        decimal amount,
        string currency,
        TransactionId referenceId,
        LedgerEntryType entryType,
        string? description)
    {
        if (walletId.IsEmpty)
            return Result<LedgerEntry>.Failure(Error.Validation("Wallet ID is required"));

        if (referenceId.IsEmpty)
            return Result<LedgerEntry>.Failure(Error.Validation("Reference ID is required"));

        if (string.IsNullOrWhiteSpace(currency))
            return Result<LedgerEntry>.Failure(Error.Validation("Currency is required"));

        var entry = new LedgerEntry
        {
            Id = LedgerEntryId.New(),
            WalletId = walletId,
            Amount = decimal.Round(amount, 4),
            Currency = currency.ToUpperInvariant(),
            ReferenceId = referenceId,
            EntryType = entryType,
            Description = description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        entry.RaiseDomainEvent(new LedgerEntryCreatedEvent(
            entry.Id,
            entry.WalletId,
            entry.Amount,
            entry.Currency,
            entry.ReferenceId,
            entry.EntryType));

        return Result<LedgerEntry>.Success(entry);
    }
}