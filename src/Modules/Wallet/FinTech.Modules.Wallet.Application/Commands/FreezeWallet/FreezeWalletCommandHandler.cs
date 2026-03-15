using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.FreezeWallet;

public sealed class FreezeWalletCommandHandler
    : IRequestHandler<FreezeWalletCommand, Result<FreezeWalletResponse>>
{
    private readonly IWalletRepository _walletRepository;

    public FreezeWalletCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Result<FreezeWalletResponse>> Handle(
        FreezeWalletCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

        var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<FreezeWalletResponse>.Failure(Error.NotFound("Wallet"));

        if (!wallet.IsOwnedBy(userId))
            return Result<FreezeWalletResponse>.Failure(Error.Forbidden("You don't have access to this wallet"));

        var freezeResult = wallet.Freeze();
        if (freezeResult.IsFailure)
            return Result<FreezeWalletResponse>.Failure(freezeResult.Error);

        _walletRepository.Update(wallet);
        await _walletRepository.SaveChangesAsync(cancellationToken);

        return Result<FreezeWalletResponse>.Success(new FreezeWalletResponse(
            wallet.Id.Value,
            wallet.Status.ToString().ToLowerInvariant(),
            wallet.UpdatedAt ?? DateTime.UtcNow));
    }
}
