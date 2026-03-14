namespace FinTech.Modules.Ledger.Application.Queries.GetBalance;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed record GetBalanceQuery(WalletId WalletId) : IRequest<Result<BalanceResponse>>;

public sealed record BalanceResponse(
    Guid WalletId,
    decimal Balance,
    string Currency,
    DateTime CalculatedAt);