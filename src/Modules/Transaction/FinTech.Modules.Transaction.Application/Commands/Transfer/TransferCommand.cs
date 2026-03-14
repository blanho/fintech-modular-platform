using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Commands.Transfer;

public sealed record TransferCommand(
    Guid SourceWalletId,
    Guid TargetWalletId,
    decimal Amount,
    string Currency,
    string? Description,
    string? IdempotencyKey) : IRequest<Result<TransferResponse>>;

public sealed record TransferResponse(
    Guid TransactionId,
    string Type,
    string Status,
    decimal Amount,
    string Currency,
    Guid SourceWalletId,
    Guid TargetWalletId,
    string? Description,
    string IdempotencyKey,
    DateTime CreatedAt,
    DateTime? CompletedAt);