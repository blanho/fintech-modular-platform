using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletById;

public sealed record GetWalletByIdQuery(
    Guid WalletId,
    Guid UserId
) : IRequest<Result<WalletDto>>;

public sealed record WalletDto(
    Guid WalletId,
    Guid UserId,
    string Currency,
    string Name,
    string Status,
    string Balance,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
