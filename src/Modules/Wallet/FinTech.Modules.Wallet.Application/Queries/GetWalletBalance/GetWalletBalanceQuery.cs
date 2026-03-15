using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletBalance;

public sealed record GetWalletBalanceQuery(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<WalletBalanceDto>>;

public sealed record WalletBalanceDto(
    Guid WalletId,
    string Currency,
    string Balance,
    string AvailableBalance,
    string PendingBalance,
    DateTime CalculatedAt
);
