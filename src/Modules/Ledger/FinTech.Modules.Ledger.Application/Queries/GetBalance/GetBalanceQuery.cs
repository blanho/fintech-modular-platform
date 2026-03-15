using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Ledger.Application.Queries.GetBalance;

public sealed record GetBalanceQuery(WalletId WalletId) : IRequest<Result<BalanceResponse>>;

public sealed record BalanceResponse(
    Guid WalletId,
    decimal Balance,
    string Currency,
    DateTime CalculatedAt);
