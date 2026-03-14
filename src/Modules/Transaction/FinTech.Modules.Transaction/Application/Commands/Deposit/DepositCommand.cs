namespace FinTech.Modules.Transaction.Application.Commands.Deposit;

using MediatR;
using FinTech.SharedKernel.Results;

public sealed record DepositCommand(
    Guid WalletId,
    decimal Amount,
    string Currency,
    string? Description,
    string? IdempotencyKey) : IRequest<Result<DepositResponse>>;

public sealed record DepositResponse(
    Guid TransactionId,
    string Type,
    string Status,
    decimal Amount,
    string Currency,
    Guid WalletId,
    string? Description,
    string IdempotencyKey,
    DateTime CreatedAt,
    DateTime? CompletedAt);