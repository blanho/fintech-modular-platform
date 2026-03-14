namespace FinTech.Modules.Identity.Domain.Events;

using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;

public sealed record UserPasswordChangedEvent(
    UserId UserId
) : DomainEventBase;