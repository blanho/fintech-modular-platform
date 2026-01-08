namespace FinTech.Modules.Wallet.Application.Queries.GetWalletById;

using FinTech.SharedKernel.Results;
using MediatR;

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