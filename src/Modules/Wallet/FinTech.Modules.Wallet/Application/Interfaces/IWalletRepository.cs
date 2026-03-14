namespace FinTech.Modules.Wallet.Application.Interfaces;

using FinTech.SharedKernel.Primitives;
using FinTech.Modules.Wallet.Domain.Entities;

public interface IWalletRepository
{

Task<Wallet?> GetByIdAsync(WalletId walletId, CancellationToken ct = default);

Task<IReadOnlyList<Wallet>> GetByUserIdAsync(UserId userId, CancellationToken ct = default);

Task<(IReadOnlyList<Wallet> Items, int TotalCount)> GetByUserIdAsync(
        UserId userId,
        int page,
        int pageSize,
        CancellationToken ct = default);

Task<bool> ExistsAsync(WalletId walletId, CancellationToken ct = default);

Task AddAsync(Wallet wallet, CancellationToken ct = default);

void Update(Wallet wallet);

Task SaveChangesAsync(CancellationToken ct = default);
}