namespace FinTech.Modules.Wallet.Application.Services;

using FinTech.SharedKernel.Contracts;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using FinTech.Modules.Wallet.Application.Interfaces;

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