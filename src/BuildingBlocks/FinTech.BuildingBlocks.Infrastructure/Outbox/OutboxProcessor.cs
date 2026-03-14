using System.Text.Json;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinTech.BuildingBlocks.Infrastructure.Outbox;

public sealed class OutboxProcessor : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OutboxProcessor> _logger;
    private readonly TimeSpan _pollingInterval = TimeSpan.FromSeconds(5);
    private const int BatchSize = 20;
    private const int MaxRetries = 3;

    public OutboxProcessor(
        IServiceScopeFactory scopeFactory,
        ILogger<OutboxProcessor> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Outbox processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessOutboxMessagesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing outbox messages");
            }

            await Task.Delay(_pollingInterval, stoppingToken);
        }

        _logger.LogInformation("Outbox processor stopped");
    }

    private async Task ProcessOutboxMessagesAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IOutboxRepository>();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();

        var messages = await repository.GetUnprocessedAsync(BatchSize, ct);

        if (messages.Count == 0)
            return;

        _logger.LogDebug("Processing {Count} outbox messages", messages.Count);

        foreach (var message in messages)
        {
            if (message.RetryCount >= MaxRetries)
            {
                _logger.LogWarning(
                    "Outbox message {MessageId} of type {Type} exceeded max retries, skipping",
                    message.Id, message.Type);
                message.MarkAsFailed($"Exceeded max retries ({MaxRetries})");
                message.MarkAsProcessed();
                await repository.UpdateAsync(message, ct);
                continue;
            }

            try
            {
                var eventType = Type.GetType(message.Type);

                if (eventType is null)
                {
                    _logger.LogWarning(
                        "Could not resolve type {Type} for outbox message {MessageId}",
                        message.Type, message.Id);
                    message.MarkAsFailed($"Type not found: {message.Type}");
                    await repository.UpdateAsync(message, ct);
                    continue;
                }

                var domainEvent = JsonSerializer.Deserialize(message.Payload, eventType);

                if (domainEvent is null)
                {
                    message.MarkAsFailed("Deserialization returned null");
                    await repository.UpdateAsync(message, ct);
                    continue;
                }

                await publisher.Publish(domainEvent, ct);

                message.MarkAsProcessed();

                _logger.LogDebug(
                    "Successfully processed outbox message {MessageId} of type {Type}",
                    message.Id, message.Type);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to process outbox message {MessageId} of type {Type}, retry {Retry}",
                    message.Id, message.Type, message.RetryCount);
                message.MarkAsFailed(ex.Message);
            }

            await repository.UpdateAsync(message, ct);
        }
    }
}
