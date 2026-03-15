using FinTech.Modules.Audit.Application.Interfaces;
using FinTech.Modules.Audit.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Audit.Infrastructure.Persistence.Repositories;

public sealed class AuditLogRepository : IAuditLogRepository
{
    private readonly AuditDbContext _context;

    public AuditLogRepository(AuditDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(AuditLog auditLog, CancellationToken ct = default)
    {
        await _context.AuditLogs.AddAsync(auditLog, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task AddRangeAsync(IEnumerable<AuditLog> auditLogs, CancellationToken ct = default)
    {
        await _context.AuditLogs.AddRangeAsync(auditLogs, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<AuditLog>> GetByFilterAsync(
        Guid? userId,
        string? action,
        string? resourceType,
        DateTime? from,
        DateTime? to,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = BuildFilterQuery(userId, action, resourceType, from, to);

        return await query
            .OrderByDescending(x => x.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<int> CountByFilterAsync(
        Guid? userId,
        string? action,
        string? resourceType,
        DateTime? from,
        DateTime? to,
        CancellationToken ct = default)
    {
        var query = BuildFilterQuery(userId, action, resourceType, from, to);
        return await query.CountAsync(ct);
    }

    private IQueryable<AuditLog> BuildFilterQuery(
        Guid? userId,
        string? action,
        string? resourceType,
        DateTime? from,
        DateTime? to)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(x => x.Action.Contains(action));

        if (!string.IsNullOrWhiteSpace(resourceType))
            query = query.Where(x => x.ResourceType == resourceType);

        if (from.HasValue)
            query = query.Where(x => x.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(x => x.Timestamp <= to.Value);

        return query;
    }
}
