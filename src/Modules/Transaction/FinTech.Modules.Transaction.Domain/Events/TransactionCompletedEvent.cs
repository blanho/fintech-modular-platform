using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Transaction.Domain.Events;

public sealed record TransactionCompletedEvent(
    TransactionId TransactionId,
    WalletId SourceWalletId,
    WalletId? TargetWalletId,
    decimal Amount,
    string Currency,
    DateTime CompletedAt) : DomainEventBase;