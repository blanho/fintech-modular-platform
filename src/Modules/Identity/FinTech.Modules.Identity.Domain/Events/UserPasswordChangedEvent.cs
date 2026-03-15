using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

namespace FinTech.Modules.Identity.Domain.Events;

public sealed record UserPasswordChangedEvent(
    UserId UserId
) : DomainEventBase;
