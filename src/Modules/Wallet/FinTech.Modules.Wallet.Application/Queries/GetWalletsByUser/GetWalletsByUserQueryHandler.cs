using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Interfaces;
using FinTech.Modules.Wallet.Application.Queries.GetWalletById;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletsByUser;

public sealed class GetWalletsByUserQueryHandler
    : IRequestHandler<GetWalletsByUserQuery, Result<GetWalletsByUserResponse>>
{
    private readonly ILedgerService _ledgerService;
    private readonly IWalletRepository _walletRepository;

    public GetWalletsByUserQueryHandler(
        IWalletRepository walletRepository,
        ILedgerService ledgerService)
    {
        _walletRepository = walletRepository;
        _ledgerService = ledgerService;
    }

    public async Task<Result<GetWalletsByUserResponse>> Handle(
        GetWalletsByUserQuery request,
        CancellationToken cancellationToken)
    {
        var userId = new UserId(request.UserId);
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var (wallets, totalCount) = await _walletRepository.GetByUserIdAsync(
            userId, page, pageSize, cancellationToken);

        var walletDtos = new List<WalletDto>();
        foreach (var wallet in wallets)
        {
            var balanceResult = await _ledgerService.GetBalanceAsync(wallet.Id, cancellationToken);
            var balanceString = balanceResult.IsSuccess
                ? balanceResult.Value!.Amount.ToString("F4")
                : "0.0000";

            walletDtos.Add(new WalletDto(
                wallet.Id.Value,
                wallet.UserId.Value,
                wallet.Currency.Code,
                wallet.Name,
                wallet.Status.ToString().ToLowerInvariant(),
                balanceString,
                wallet.CreatedAt,
                wallet.UpdatedAt));
        }

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return Result<GetWalletsByUserResponse>.Success(new GetWalletsByUserResponse(
            walletDtos,
            page,
            pageSize,
            totalCount,
            totalPages,
            page < totalPages,
            page > 1));
    }
}
