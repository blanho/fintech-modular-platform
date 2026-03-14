using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Ledger.Domain.Enums;

namespace FinTech.Modules.Ledger.Domain.Events;

public sealed record LedgerEntryCreatedEvent(
    LedgerEntryId EntryId,
    WalletId WalletId,
    decimal Amount,
    string Currency,
    TransactionId ReferenceId,
    LedgerEntryType EntryType) : DomainEventBase;