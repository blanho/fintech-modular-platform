namespace FinTech.Modules.Transaction.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record TransactionCompletedEvent(
    TransactionId TransactionId,
    WalletId SourceWalletId,
    WalletId? TargetWalletId,
    decimal Amount,
    string Currency,
    DateTime CompletedAt) : DomainEventBase;