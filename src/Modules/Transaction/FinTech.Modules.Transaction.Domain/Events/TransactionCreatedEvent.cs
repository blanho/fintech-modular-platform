using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Transaction.Domain.Enums;

namespace FinTech.Modules.Transaction.Domain.Events;

public sealed record TransactionCreatedEvent(
    TransactionId TransactionId,
    TransactionType Type,
    decimal Amount,
    string Currency,
    WalletId SourceWalletId,
    WalletId? TargetWalletId,
    string? IdempotencyKey) : DomainEventBase;
