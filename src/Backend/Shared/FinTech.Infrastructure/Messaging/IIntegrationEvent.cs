namespace FinTech.Infrastructure.Messaging;

public interface IIntegrationEvent
{

Guid EventId { get; }

DateTime OccurredAt { get; }

string? CorrelationId { get; }
}

public abstract record IntegrationEventBase : IIntegrationEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
    public string? CorrelationId { get; init; }
}