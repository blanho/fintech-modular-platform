namespace FinTech.Modules.Ledger.Application.Interfaces;

using FinTech.Modules.Ledger.Domain.Entities;
using FinTech.SharedKernel.Primitives;

public interface ILedgerRepository
{

Task<IEnumerable<LedgerEntry>> GetByWalletIdAsync(
        WalletId walletId,
        CancellationToken ct = default);

Task<(IEnumerable<LedgerEntry> Entries, int TotalCount)> GetByWalletIdAsync(
        WalletId walletId,
        int page,
        int pageSize,
        CancellationToken ct = default);

Task<IEnumerable<LedgerEntry>> GetByReferenceIdAsync(
        TransactionId referenceId,
        CancellationToken ct = default);

Task<decimal> GetBalanceAsync(WalletId walletId, CancellationToken ct = default);

Task<string?> GetWalletCurrencyAsync(WalletId walletId, CancellationToken ct = default);

Task AddAsync(LedgerEntry entry, CancellationToken ct = default);

Task SaveChangesAsync(CancellationToken ct = default);

}