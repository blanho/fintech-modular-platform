using FinTech.Modules.Audit.Domain.Enums;

namespace FinTech.Modules.Audit.Domain.Entities;

public sealed class AuditLog
{
    public Guid Id { get; private set; }
    public Guid? UserId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public AuditAction ActionType { get; private set; }
    public string ResourceType { get; private set; } = string.Empty;
    public string? ResourceId { get; private set; }
    public bool IsSuccess { get; private set; }
    public string? ErrorMessage { get; private set; }
    public long DurationMs { get; private set; }
    public string? IpAddress { get; private set; }
    public string? UserAgent { get; private set; }
    public string? CorrelationId { get; private set; }
    public DateTime Timestamp { get; private set; }

    private AuditLog() { }

    public static AuditLog Create(
        Guid? userId,
        string action,
        string resourceType,
        string? resourceId,
        bool isSuccess,
        string? errorMessage,
        long durationMs,
        string? ipAddress,
        string? userAgent,
        string? correlationId)
    {
        return new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Action = action,
            ActionType = ClassifyAction(action),
            ResourceType = resourceType,
            ResourceId = resourceId,
            IsSuccess = isSuccess,
            ErrorMessage = errorMessage,
            DurationMs = durationMs,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CorrelationId = correlationId,
            Timestamp = DateTime.UtcNow
        };
    }

    private static AuditAction ClassifyAction(string action)
    {
        if (action.Contains("Login", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Login;
        if (action.Contains("Register", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Create", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Create;
        if (action.Contains("Update", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Change", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Rename", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Update;
        if (action.Contains("Delete", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Remove", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Deactivate", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Delete;
        if (action.Contains("Query", StringComparison.OrdinalIgnoreCase) ||
            action.Contains("Get", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Query;
        if (action.Contains("Export", StringComparison.OrdinalIgnoreCase))
            return AuditAction.Export;

        return AuditAction.Execute;
    }
}
