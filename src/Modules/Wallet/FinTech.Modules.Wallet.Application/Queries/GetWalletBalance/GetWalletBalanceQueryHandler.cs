using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletBalance;

public sealed class GetWalletBalanceQueryHandler
    : IRequestHandler<GetWalletBalanceQuery, Result<WalletBalanceDto>>
{
    private readonly ILedgerService _ledgerService;
    private readonly IWalletRepository _walletRepository;

    public GetWalletBalanceQueryHandler(
        IWalletRepository walletRepository,
        ILedgerService ledgerService)
    {
        _walletRepository = walletRepository;
        _ledgerService = ledgerService;
    }

    public async Task<Result<WalletBalanceDto>> Handle(
        GetWalletBalanceQuery request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);
        var userId = new UserId(request.UserId);

        var wallet = await _walletRepository.GetByIdAsync(walletId, cancellationToken);
        if (wallet is null)
            return Result<WalletBalanceDto>.Failure(Error.NotFound("Wallet"));

        if (!wallet.IsOwnedBy(userId))
            return Result<WalletBalanceDto>.Failure(Error.Forbidden("You don't have access to this wallet"));

        var balanceResult = await _ledgerService.GetBalanceAsync(walletId, cancellationToken);
        if (balanceResult.IsFailure)
            return Result<WalletBalanceDto>.Failure(balanceResult.Error);

        var balance = balanceResult.Value!;

        return Result<WalletBalanceDto>.Success(new WalletBalanceDto(
            wallet.Id.Value,
            wallet.Currency.Code,
            balance.Amount.ToString("F4"),
            balance.Amount.ToString("F4"),
            "0.0000",
            DateTime.UtcNow));
    }
}