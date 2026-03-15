using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;

namespace FinTech.Modules.Wallet.Application.Services;

public sealed class WalletService : IWalletService
{
    private readonly IWalletRepository _walletRepository;

    public WalletService(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Result<WalletInfo>> GetWalletInfoAsync(
        WalletId walletId,
        CancellationToken ct = default)
    {
        var wallet = await _walletRepository.GetByIdAsync(walletId, ct);
        if (wallet is null)
            return Result<WalletInfo>.Failure(Error.NotFound("Wallet"));

        return Result<WalletInfo>.Success(new WalletInfo(
            wallet.Id,
            wallet.UserId,
            wallet.Currency.Code,
            wallet.Status.ToString().ToLowerInvariant()));
    }

    public async Task<Result<bool>> ValidateOwnershipAsync(
        WalletId walletId,
        UserId userId,
        CancellationToken ct = default)
    {
        var wallet = await _walletRepository.GetByIdAsync(walletId, ct);
        if (wallet is null)
            return Result<bool>.Failure(Error.NotFound("Wallet"));

        return Result<bool>.Success(wallet.IsOwnedBy(userId));
    }

    public async Task<Result> CanTransactAsync(
        WalletId walletId,
        CancellationToken ct = default)
    {
        var wallet = await _walletRepository.GetByIdAsync(walletId, ct);
        if (wallet is null)
            return Result.Failure(Error.NotFound("Wallet"));

        return wallet.CanTransact();
    }
}
