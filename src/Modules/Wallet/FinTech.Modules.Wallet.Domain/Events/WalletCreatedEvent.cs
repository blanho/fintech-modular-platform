using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Wallet.Domain.Events;

public sealed record WalletCreatedEvent(
    WalletId WalletId,
    UserId UserId,
    string Currency,
    string Name
) : DomainEventBase;
