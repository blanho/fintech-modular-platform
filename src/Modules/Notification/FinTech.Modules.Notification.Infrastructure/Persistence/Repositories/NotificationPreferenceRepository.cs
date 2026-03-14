using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Notification.Infrastructure.Persistence.Repositories;

public class NotificationPreferenceRepository : INotificationPreferenceRepository
{
    private readonly NotificationDbContext _context;

    public NotificationPreferenceRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<NotificationPreference?> GetByIdAsync(NotificationPreferenceId id, CancellationToken ct = default)
    {
        return await _context.NotificationPreferences.FindAsync(new object[] { id }, ct);
    }

    public async Task<NotificationPreference?> GetByUserIdAsync(UserId userId, CancellationToken ct = default)
    {
        return await _context.NotificationPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId, ct);
    }

    public async Task AddAsync(NotificationPreference preference, CancellationToken ct = default)
    {
        await _context.NotificationPreferences.AddAsync(preference, ct);
    }

    public void Update(NotificationPreference preference)
    {
        _context.NotificationPreferences.Update(preference);
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }
}