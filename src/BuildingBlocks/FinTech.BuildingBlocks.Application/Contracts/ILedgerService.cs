using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;

namespace FinTech.BuildingBlocks.Application.Contracts;

public interface ILedgerService
{
    Task<Result<Money>> GetBalanceAsync(WalletId walletId, CancellationToken ct = default);

    Task<Result<bool>> HasSufficientBalanceAsync(WalletId walletId, Money amount, CancellationToken ct = default);

    Task<Result<LedgerEntryId>> AppendCreditAsync(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description,
        CancellationToken ct = default);

    Task<Result<LedgerEntryId>> AppendDebitAsync(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description,
        CancellationToken ct = default);
}