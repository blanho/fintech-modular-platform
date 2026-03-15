namespace FinTech.Modules.Audit.Application.Interfaces;

public interface IAuditService
{
    Task RecordAsync(AuditEntry entry, CancellationToken ct = default);
}

public sealed record AuditEntry(
    Guid? UserId,
    string Action,
    string ResourceType,
    string? ResourceId,
    bool IsSuccess,
    string? ErrorMessage,
    long DurationMs,
    string? IpAddress,
    string? UserAgent,
    string? CorrelationId);
