namespace FinTech.Modules.Transaction.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;
using FinTech.Modules.Transaction.Domain.Enums;

public sealed record TransactionCreatedEvent(
    TransactionId TransactionId,
    TransactionType Type,
    decimal Amount,
    string Currency,
    WalletId SourceWalletId,
    WalletId? TargetWalletId,
    string? IdempotencyKey) : DomainEventBase;