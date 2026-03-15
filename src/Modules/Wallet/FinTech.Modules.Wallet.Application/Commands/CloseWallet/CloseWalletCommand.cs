using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.CloseWallet;

public sealed record CloseWalletCommand(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<CloseWalletResponse>>;

public sealed record CloseWalletResponse(
    Guid WalletId,
    string Status,
    DateTime ClosedAt
);
