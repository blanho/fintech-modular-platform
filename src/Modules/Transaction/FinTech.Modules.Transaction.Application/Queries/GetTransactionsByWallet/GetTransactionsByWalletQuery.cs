using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Transaction.Application.Queries.GetTransactionById;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Queries.GetTransactionsByWallet;

public sealed record GetTransactionsByWalletQuery(
    Guid WalletId,
    int Page = 1,
    int PageSize = 20,
    string? Type = null,
    string? Status = null,
    DateTime? FromDate = null,
    DateTime? ToDate = null) : IRequest<Result<GetTransactionsByWalletResponse>>;

public sealed record GetTransactionsByWalletResponse(
    IReadOnlyList<TransactionDto> Transactions,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages,
    bool HasNext,
    bool HasPrevious);