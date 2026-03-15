using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Commands.CreateWallet;

public sealed record CreateWalletCommand(
    Guid UserId,
    string Currency,
    string? Name
) : IRequest<Result<CreateWalletResponse>>;

public sealed record CreateWalletResponse(
    Guid WalletId,
    Guid UserId,
    string Currency,
    string Name,
    string Status,
    DateTime CreatedAt
);
