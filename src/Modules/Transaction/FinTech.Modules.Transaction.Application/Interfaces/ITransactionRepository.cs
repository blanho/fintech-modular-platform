using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Transaction.Domain.Enums;

namespace FinTech.Modules.Transaction.Application.Interfaces;

public interface ITransactionRepository
{
    Task<Domain.Entities.Transaction?> GetByIdAsync(TransactionId id, CancellationToken ct = default);
    Task<Domain.Entities.Transaction?> GetByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default);

    Task<IReadOnlyList<Domain.Entities.Transaction>> GetByWalletIdAsync(
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

    Task AddAsync(Domain.Entities.Transaction transaction, CancellationToken ct = default);
    void Update(Domain.Entities.Transaction transaction);
    Task SaveChangesAsync(CancellationToken ct = default);
}
