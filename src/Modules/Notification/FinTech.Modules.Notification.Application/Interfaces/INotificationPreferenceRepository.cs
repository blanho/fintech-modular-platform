using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Primitives;

namespace FinTech.Modules.Notification.Application.Interfaces;

public interface INotificationPreferenceRepository
{
    Task<NotificationPreference?> GetByIdAsync(NotificationPreferenceId id, CancellationToken ct = default);

    Task<NotificationPreference?> GetByUserIdAsync(UserId userId, CancellationToken ct = default);

    Task AddAsync(NotificationPreference preference, CancellationToken ct = default);

    void Update(NotificationPreference preference);

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
