namespace FinTech.Infrastructure.Messaging;

public interface IEventPublisher
{

Task PublishAsync<T>(T @event, CancellationToken ct = default) where T : class, IIntegrationEvent;

Task SendAsync<T>(T command, Uri destinationAddress, CancellationToken ct = default) where T : class;
}