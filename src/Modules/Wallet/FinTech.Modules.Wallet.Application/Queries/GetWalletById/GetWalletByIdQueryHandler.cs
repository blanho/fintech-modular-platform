using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletById;

public sealed class GetWalletByIdQueryHandler
    : IRequestHandler<GetWalletByIdQuery, Result<WalletDto>>
{
    private readonly ILedgerService _ledgerService;
    private readonly IWalletRepository _walletRepository;

    public GetWalletByIdQueryHandler(
        IWalletRepository walletRepository,
        ILedgerService ledgerService)
    {
        _walletRepository = walletRepository;
        _ledgerService = ledgerService;
    }

    public async Task<Result<WalletDto>> Handle(
        GetWalletByIdQuery request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

        var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<WalletDto>.Failure(Error.NotFound("Wallet"));

        if (!wallet.IsOwnedBy(userId))
            return Result<WalletDto>.Failure(Error.Forbidden("You don't have access to this wallet"));

        var balanceResult = await _ledgerService.GetBalanceAsync(walletId, cancellationToken);
        var balanceString = balanceResult.IsSuccess
            ? balanceResult.Value!.Amount.ToString("F4")
            : "0.0000";

        return Result<WalletDto>.Success(new WalletDto(
            wallet.Id.Value,
            wallet.UserId.Value,
            wallet.Currency.Code,
            wallet.Name,
            wallet.Status.ToString().ToLowerInvariant(),
            balanceString,
            wallet.CreatedAt,
            wallet.UpdatedAt));
    }
}