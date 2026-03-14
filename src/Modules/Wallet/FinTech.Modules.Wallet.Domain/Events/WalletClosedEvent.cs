using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Wallet.Domain.Events;

public sealed record WalletClosedEvent(
    WalletId WalletId,
    UserId UserId
) : DomainEventBase;