namespace FinTech.BuildingBlocks.EventBus;

public interface IIntegrationEvent
{
    Guid EventId { get; }
    DateTime OccurredAt { get; }
}