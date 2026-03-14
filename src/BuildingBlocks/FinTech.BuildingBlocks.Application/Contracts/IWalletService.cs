namespace FinTech.BuildingBlocks.Application.Contracts;

using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;

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
