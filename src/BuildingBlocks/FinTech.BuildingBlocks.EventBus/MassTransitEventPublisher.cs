using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.BuildingBlocks.EventBus;

public sealed class MassTransitEventPublisher : IEventPublisher
{
    private readonly ILogger<MassTransitEventPublisher> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public MassTransitEventPublisher(
        IPublishEndpoint publishEndpoint,
        ILogger<MassTransitEventPublisher> logger)
    {
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken ct = default)
        where TEvent : class, IIntegrationEvent
    {
        _logger.LogInformation(
            "Publishing integration event {EventType} with Id {EventId}",
            typeof(TEvent).Name,
            @event.EventId);

        await _publishEndpoint.Publish(@event, ct);
    }
}