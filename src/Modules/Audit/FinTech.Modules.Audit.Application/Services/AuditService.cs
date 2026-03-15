using System.Threading.Channels;
using FinTech.Modules.Audit.Application.Interfaces;
using FinTech.Modules.Audit.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Audit.Application.Services;

public sealed class AuditService : IAuditService
{
    private readonly ChannelWriter<AuditLog> _writer;
    private readonly ILogger<AuditService> _logger;

    public AuditService(
        ChannelWriter<AuditLog> writer,
        ILogger<AuditService> logger)
    {
        _writer = writer;
        _logger = logger;
    }

    public Task RecordAsync(AuditEntry entry, CancellationToken ct = default)
    {
        var auditLog = AuditLog.Create(
            entry.UserId,
            entry.Action,
            entry.ResourceType,
            entry.ResourceId,
            entry.IsSuccess,
            entry.ErrorMessage,
            entry.DurationMs,
            entry.IpAddress,
            entry.UserAgent,
            entry.CorrelationId);

        if (!_writer.TryWrite(auditLog))
        {
            _logger.LogWarning(
                "Audit channel is full, dropping entry for action {Action} by user {UserId}",
                entry.Action,
                entry.UserId);
        }

        return Task.CompletedTask;
    }
}
