using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Transaction.Domain.Events;

public sealed record TransactionFailedEvent(
    TransactionId TransactionId,
    WalletId SourceWalletId,
    string Reason) : DomainEventBase;
