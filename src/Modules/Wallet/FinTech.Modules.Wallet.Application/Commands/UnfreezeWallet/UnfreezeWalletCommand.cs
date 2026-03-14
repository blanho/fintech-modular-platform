using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.UnfreezeWallet;

public sealed record UnfreezeWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<UnfreezeWalletResponse>>;

public sealed record UnfreezeWalletResponse(
    Guid WalletId,
    string Status,
    DateTime UnfrozenAt
);