using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Ledger.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Ledger.Application.Queries.GetBalance;

public sealed class GetBalanceQueryHandler : IRequestHandler<GetBalanceQuery, Result<BalanceResponse>>
{
    private readonly ILedgerRepository _repository;

    public GetBalanceQueryHandler(ILedgerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<BalanceResponse>> Handle(GetBalanceQuery request, CancellationToken ct)
    {
        var balance = await _repository.GetBalanceAsync(request.WalletId, ct);
        var currency = await _repository.GetWalletCurrencyAsync(request.WalletId, ct);

        var currencyCode = currency ?? "USD";

        return Result<BalanceResponse>.Success(new BalanceResponse(
            request.WalletId.Value,
            balance,
            currencyCode,
            DateTime.UtcNow));
    }
}
