namespace FinTech.Modules.Identity.Domain.Events;

using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record UserPasswordChangedEvent(
    UserId UserId
) : DomainEventBase;