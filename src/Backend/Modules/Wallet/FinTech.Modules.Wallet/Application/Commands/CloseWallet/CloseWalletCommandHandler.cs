namespace FinTech.Modules.Wallet.Application.Commands.CloseWallet;

using FinTech.SharedKernel.Contracts;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

public sealed class CloseWalletCommandHandler
    : IRequestHandler<CloseWalletCommand, Result<CloseWalletResponse>>
{
    private readonly IWalletRepository _walletRepository;
    private readonly ILedgerService _ledgerService;

    public CloseWalletCommandHandler(
        IWalletRepository walletRepository,
        ILedgerService ledgerService)
    {
        _walletRepository = walletRepository;
        _ledgerService = ledgerService;
    }

    public async Task<Result<CloseWalletResponse>> Handle(
        CloseWalletCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<CloseWalletResponse>.Failure(Error.NotFound("Wallet"));

if (!wallet.IsOwnedBy(userId))
            return Result<CloseWalletResponse>.Failure(Error.Forbidden("You don't have access to this wallet"));

var balanceResult = await _ledgerService.GetBalanceAsync(walletId, cancellationToken);
        if (balanceResult.IsFailure)
            return Result<CloseWalletResponse>.Failure(balanceResult.Error);

        var balance = balanceResult.Value!;
        if (!balance.IsZero)
        {
            return Result<CloseWalletResponse>.Failure(
                new Error("WALLET_HAS_BALANCE", $"Cannot close wallet with non-zero balance. Current balance: {balance}"));
        }

var closeResult = wallet.Close();
        if (closeResult.IsFailure)
            return Result<CloseWalletResponse>.Failure(closeResult.Error);

_walletRepository.Update(wallet);
        await _walletRepository.SaveChangesAsync(cancellationToken);

        return Result<CloseWalletResponse>.Success(new CloseWalletResponse(
            wallet.Id.Value,
            wallet.Status.ToString().ToLowerInvariant(),
            wallet.UpdatedAt ?? DateTime.UtcNow));
    }
}