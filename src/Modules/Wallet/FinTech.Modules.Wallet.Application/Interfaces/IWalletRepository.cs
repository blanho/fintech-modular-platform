using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Wallet.Application.Interfaces;

public interface IWalletRepository
{
    Task<Domain.Entities.Wallet?> GetByIdAsync(WalletId walletId, CancellationToken ct = default);

    Task<IReadOnlyList<Domain.Entities.Wallet>> GetByUserIdAsync(UserId userId, CancellationToken ct = default);

    Task<(IReadOnlyList<Domain.Entities.Wallet> Items, int TotalCount)> GetByUserIdAsync(
        UserId userId,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<bool> ExistsAsync(WalletId walletId, CancellationToken ct = default);

    Task AddAsync(Domain.Entities.Wallet wallet, CancellationToken ct = default);

    void Update(Domain.Entities.Wallet wallet);

    Task SaveChangesAsync(CancellationToken ct = default);
}