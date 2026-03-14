using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.RenameWallet;

public sealed class RenameWalletCommandHandler
    : IRequestHandler<RenameWalletCommand, Result<RenameWalletResponse>>
{
    private readonly IWalletRepository _walletRepository;

    public RenameWalletCommandHandler(IWalletRepository walletRepository)
    {
        _walletRepository = walletRepository;
    }

    public async Task<Result<RenameWalletResponse>> Handle(
        RenameWalletCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

        var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<RenameWalletResponse>.Failure(Error.NotFound("Wallet"));

        if (!wallet.IsOwnedBy(userId))
            return Result<RenameWalletResponse>.Failure(Error.Forbidden("You don't have access to this wallet"));

        var renameResult = wallet.Rename(request.Name);
        if (renameResult.IsFailure)
            return Result<RenameWalletResponse>.Failure(renameResult.Error);

        _walletRepository.Update(wallet);
        await _walletRepository.SaveChangesAsync(cancellationToken);

        return Result<RenameWalletResponse>.Success(new RenameWalletResponse(
            wallet.Id.Value,
            wallet.Name,
            wallet.UpdatedAt ?? DateTime.UtcNow));
    }
}