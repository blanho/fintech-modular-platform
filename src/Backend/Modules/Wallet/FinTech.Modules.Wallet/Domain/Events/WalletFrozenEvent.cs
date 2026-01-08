namespace FinTech.Modules.Wallet.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record WalletFrozenEvent(
    WalletId WalletId,
    UserId UserId
) : DomainEventBase;