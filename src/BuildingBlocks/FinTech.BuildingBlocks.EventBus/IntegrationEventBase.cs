namespace FinTech.BuildingBlocks.EventBus;

public abstract record IntegrationEventBase : IIntegrationEvent
{
    public Guid CorrelationId { get; init; } = Guid.NewGuid();
    public Guid EventId { get; init; } = Guid.NewGuid();
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
