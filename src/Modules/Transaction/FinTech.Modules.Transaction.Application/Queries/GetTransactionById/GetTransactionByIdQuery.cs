using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Queries.GetTransactionById;

public sealed record GetTransactionByIdQuery(Guid TransactionId) : IRequest<Result<TransactionDto>>;

public sealed record TransactionDto(
    Guid TransactionId,
    string Type,
    string Status,
    decimal Amount,
    string Currency,
    Guid SourceWalletId,
    Guid? TargetWalletId,
    string? Description,
    string IdempotencyKey,
    string? FailureReason,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? CompletedAt);