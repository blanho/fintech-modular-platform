namespace FinTech.Modules.Transaction.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record TransactionFailedEvent(
    TransactionId TransactionId,
    WalletId SourceWalletId,
    string Reason) : DomainEventBase;