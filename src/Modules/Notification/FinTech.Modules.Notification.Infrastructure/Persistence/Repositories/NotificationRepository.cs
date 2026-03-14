using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Notification.Infrastructure.Persistence.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly NotificationDbContext _context;

    public NotificationRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Notification?> GetByIdAsync(NotificationId id, CancellationToken ct = default)
    {
        return await _context.Notifications.FindAsync(new object[] { id }, ct);
    }

    public async Task<IReadOnlyList<Domain.Entities.Notification>> GetByUserIdAsync(
        UserId userId,
        NotificationStatus? status = null,
        NotificationCategory? category = null,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _context.Notifications.Where(n => n.UserId == userId);

        if (status.HasValue)
            query = query.Where(n => n.Status == status.Value);

        if (category.HasValue)
            query = query.Where(n => n.Category == category.Value);

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<int> GetCountByUserIdAsync(
        UserId userId,
        NotificationStatus? status = null,
        NotificationCategory? category = null,
        CancellationToken ct = default)
    {
        var query = _context.Notifications.Where(n => n.UserId == userId);

        if (status.HasValue)
            query = query.Where(n => n.Status == status.Value);

        if (category.HasValue)
            query = query.Where(n => n.Category == category.Value);

        return await query.CountAsync(ct);
    }

    public async Task<IReadOnlyList<Domain.Entities.Notification>> GetPendingAsync(int limit = 100,
        CancellationToken ct = default)
    {
        return await _context.Notifications
            .Where(n => n.Status == NotificationStatus.Pending)
            .OrderBy(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Domain.Entities.Notification>> GetFailedForRetryAsync(int maxRetries = 3,
        int limit = 100, CancellationToken ct = default)
    {
        return await _context.Notifications
            .Where(n => n.Status == NotificationStatus.Failed && n.RetryCount < maxRetries)
            .OrderBy(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Domain.Entities.Notification notification, CancellationToken ct = default)
    {
        await _context.Notifications.AddAsync(notification, ct);
    }

    public void Update(Domain.Entities.Notification notification)
    {
        _context.Notifications.Update(notification);
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }
}