namespace FinTech.Modules.Wallet.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record WalletCreatedEvent(
    WalletId WalletId,
    UserId UserId,
    string Currency,
    string Name
) : DomainEventBase;