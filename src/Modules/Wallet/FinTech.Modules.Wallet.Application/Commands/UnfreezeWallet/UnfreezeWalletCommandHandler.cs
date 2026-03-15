using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.UnfreezeWallet;

public sealed class UnfreezeWalletCommandHandler
    : IRequestHandler<UnfreezeWalletCommand, Result<UnfreezeWalletResponse>>
{
    private readonly IWalletRepository _walletRepository;

    public UnfreezeWalletCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Result<UnfreezeWalletResponse>> Handle(
        UnfreezeWalletCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

        var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<UnfreezeWalletResponse>.Failure(Error.NotFound("Wallet"));

        if (!wallet.IsOwnedBy(userId))
            return Result<UnfreezeWalletResponse>.Failure(Error.Forbidden("You don't have access to this wallet"));

        var unfreezeResult = wallet.Unfreeze();
        if (unfreezeResult.IsFailure)
            return Result<UnfreezeWalletResponse>.Failure(unfreezeResult.Error);

        _walletRepository.Update(wallet);
        await _walletRepository.SaveChangesAsync(cancellationToken);

        return Result<UnfreezeWalletResponse>.Success(new UnfreezeWalletResponse(
            wallet.Id.Value,
            wallet.Status.ToString().ToLowerInvariant(),
            wallet.UpdatedAt ?? DateTime.UtcNow));
    }
}
