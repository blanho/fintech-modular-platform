namespace FinTech.SharedKernel.Contracts;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;

public interface IWalletService
{

Task<Result<WalletInfo>> GetWalletInfoAsync(WalletId walletId, CancellationToken ct = default);

Task<Result<bool>> ValidateOwnershipAsync(WalletId walletId, UserId userId, CancellationToken ct = default);

Task<Result> CanTransactAsync(WalletId walletId, CancellationToken ct = default);
}

public record WalletInfo(
    WalletId Id,
    UserId UserId,
    string Currency,
    string Status);