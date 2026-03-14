using MediatR;

namespace FinTech.BuildingBlocks.Domain;

public interface IDomainEvent : INotification
{
    Guid EventId { get; }
    DateTime OccurredAt { get; }
}