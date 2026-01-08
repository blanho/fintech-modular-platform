namespace FinTech.Modules.Wallet.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record WalletClosedEvent(
    WalletId WalletId,
    UserId UserId
) : DomainEventBase;