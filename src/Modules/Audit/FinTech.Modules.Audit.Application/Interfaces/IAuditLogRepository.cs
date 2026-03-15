using FinTech.Modules.Audit.Domain.Entities;

namespace FinTech.Modules.Audit.Application.Interfaces;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog auditLog, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<AuditLog> auditLogs, CancellationToken ct = default);
    Task<IReadOnlyList<AuditLog>> GetByFilterAsync(
        Guid? userId,
        string? action,
        string? resourceType,
        DateTime? from,
        DateTime? to,
        int page,
        int pageSize,
        CancellationToken ct = default);
    Task<int> CountByFilterAsync(
        Guid? userId,
        string? action,
        string? resourceType,
        DateTime? from,
        DateTime? to,
        CancellationToken ct = default);
}
