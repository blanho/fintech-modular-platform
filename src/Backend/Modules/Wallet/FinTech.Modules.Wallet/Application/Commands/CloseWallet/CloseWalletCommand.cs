namespace FinTech.Modules.Wallet.Application.Commands.CloseWallet;

using FinTech.SharedKernel.Results;
using MediatR;

public sealed record CloseWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<CloseWalletResponse>>;

public sealed record CloseWalletResponse(
    Guid WalletId,
    string Status,
    DateTime ClosedAt
);