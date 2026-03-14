using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.FreezeWallet;

public sealed record FreezeWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<FreezeWalletResponse>>;

public sealed record FreezeWalletResponse(
    Guid WalletId,
    string Status,
    DateTime FrozenAt
);