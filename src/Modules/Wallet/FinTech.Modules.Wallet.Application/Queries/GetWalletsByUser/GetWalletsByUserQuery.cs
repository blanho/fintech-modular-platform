using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Wallet.Application.Queries.GetWalletById;
using MediatR;

namespace FinTech.Modules.Wallet.Application.Queries.GetWalletsByUser;

public sealed record GetWalletsByUserQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<GetWalletsByUserResponse>>;

public sealed record GetWalletsByUserResponse(
    IReadOnlyList<WalletDto> Wallets,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages,
    bool HasNext,
    bool HasPrevious
);
