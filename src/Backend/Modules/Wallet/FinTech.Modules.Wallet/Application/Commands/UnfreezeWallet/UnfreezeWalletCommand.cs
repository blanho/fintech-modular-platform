namespace FinTech.Modules.Wallet.Application.Commands.UnfreezeWallet;

using FinTech.SharedKernel.Results;
using MediatR;

public sealed record UnfreezeWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<UnfreezeWalletResponse>>;

public sealed record UnfreezeWalletResponse(
    Guid WalletId,
    string Status,
    DateTime UnfrozenAt
);