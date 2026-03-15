using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Wallet.Domain.Events;

public sealed record WalletFrozenEvent(
    WalletId WalletId,
    UserId UserId
) : DomainEventBase;
