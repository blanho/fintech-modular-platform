namespace FinTech.Infrastructure.Messaging;

using MassTransit;
using Microsoft.Extensions.Logging;

public class MassTransitEventPublisher : IEventPublisher
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ISendEndpointProvider _sendEndpointProvider;
    private readonly ILogger<MassTransitEventPublisher> _logger;

    public MassTransitEventPublisher(
        IPublishEndpoint publishEndpoint,
        ISendEndpointProvider sendEndpointProvider,
        ILogger<MassTransitEventPublisher> logger)
    {
        _publishEndpoint = publishEndpoint;
        _sendEndpointProvider = sendEndpointProvider;
        _logger = logger;
    }

    public async Task PublishAsync<T>(T @event, CancellationToken ct = default) where T : class, IIntegrationEvent
    {
        try
        {
            _logger.LogInformation(
                "Publishing integration event {EventType} with ID {EventId}",
                typeof(T).Name,
                @event.EventId);

            await _publishEndpoint.Publish(@event, ct);

            _logger.LogDebug(
                "Successfully published integration event {EventType} with ID {EventId}",
                typeof(T).Name,
                @event.EventId);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to publish integration event {EventType} with ID {EventId}",
                typeof(T).Name,
                @event.EventId);
            throw;
        }
    }

    public async Task SendAsync<T>(T command, Uri destinationAddress, CancellationToken ct = default) where T : class
    {
        try
        {
            var sendEndpoint = await _sendEndpointProvider.GetSendEndpoint(destinationAddress);
            await sendEndpoint.Send(command, ct);

            _logger.LogDebug(
                "Successfully sent command {CommandType} to {Destination}",
                typeof(T).Name,
                destinationAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send command {CommandType} to {Destination}",
                typeof(T).Name,
                destinationAddress);
            throw;
        }
    }
}