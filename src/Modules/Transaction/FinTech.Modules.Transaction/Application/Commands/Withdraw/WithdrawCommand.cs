namespace FinTech.Modules.Transaction.Application.Commands.Withdraw;

using MediatR;
using FinTech.SharedKernel.Results;

public sealed record WithdrawCommand(
    Guid WalletId,
    decimal Amount,
    string Currency,
    string? Description,
    string? IdempotencyKey) : IRequest<Result<WithdrawResponse>>;

public sealed record WithdrawResponse(
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