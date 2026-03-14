namespace FinTech.Modules.Transaction.Application.Interfaces;

using FinTech.SharedKernel.Primitives;
using FinTech.Modules.Transaction.Domain.Entities;
using FinTech.Modules.Transaction.Domain.Enums;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(TransactionId id, CancellationToken ct = default);
    Task<Transaction?> GetByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default);
    Task<IReadOnlyList<Transaction>> GetByWalletIdAsync(
        WalletId walletId,
        int page = 1,
        int pageSize = 20,
        TransactionType? type = null,
        TransactionStatus? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        CancellationToken ct = default);
    Task<int> GetCountByWalletIdAsync(
        WalletId walletId,
        TransactionType? type = null,
        TransactionStatus? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        CancellationToken ct = default);
    Task AddAsync(Transaction transaction, CancellationToken ct = default);
    void Update(Transaction transaction);
    Task SaveChangesAsync(CancellationToken ct = default);
}