namespace FinTech.Modules.Ledger.Domain.Events;

using FinTech.Modules.Ledger.Domain.Enums;
using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record LedgerEntryCreatedEvent(
    LedgerEntryId EntryId,
    WalletId WalletId,
    decimal Amount,
    string Currency,
    TransactionId ReferenceId,
    LedgerEntryType EntryType) : DomainEventBase;