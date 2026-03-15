using System.Threading.Channels;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Audit.Domain.Entities;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Audit.Infrastructure.Consumers;

public sealed class AuditRequestedConsumer : IConsumer<AuditRequestedIntegrationEvent>
{
    private readonly ChannelWriter<AuditLog> _writer;
    private readonly ILogger<AuditRequestedConsumer> _logger;

    public AuditRequestedConsumer(
        ChannelWriter<AuditLog> writer,
        ILogger<AuditRequestedConsumer> logger)
    {
        _writer = writer;
        _logger = logger;
    }

    public Task Consume(ConsumeContext<AuditRequestedIntegrationEvent> context)
    {
        var message = context.Message;

        var auditLog = AuditLog.Create(
            message.UserId,
            message.Action,
            message.ResourceType,
            message.ResourceId,
            message.IsSuccess,
            message.ErrorMessage,
            message.DurationMs,
            message.IpAddress,
            message.UserAgent,
            message.CorrelationId.ToString());

        if (!_writer.TryWrite(auditLog))
        {
            _logger.LogWarning(
                "Audit channel is full, dropping entry for action {Action} by user {UserId}",
                message.Action,
                message.UserId);
        }

        return Task.CompletedTask;
    }
}
