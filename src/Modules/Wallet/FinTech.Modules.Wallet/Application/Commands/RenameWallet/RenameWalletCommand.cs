namespace FinTech.Modules.Wallet.Application.Commands.RenameWallet;

using FinTech.SharedKernel.Results;
using MediatR;

public sealed record RenameWalletCommand(
    Guid WalletId,
    Guid UserId,
    string Name
) : IRequest<Result<RenameWalletResponse>>;

public sealed record RenameWalletResponse(
    Guid WalletId,
    string Name,
    DateTime UpdatedAt
);