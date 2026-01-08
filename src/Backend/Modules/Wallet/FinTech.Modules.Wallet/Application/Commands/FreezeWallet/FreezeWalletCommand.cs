namespace FinTech.Modules.Wallet.Application.Commands.FreezeWallet;

using FinTech.SharedKernel.Results;
using MediatR;

public sealed record FreezeWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<FreezeWalletResponse>>;

public sealed record FreezeWalletResponse(
    Guid WalletId,
    string Status,
    DateTime FrozenAt
);