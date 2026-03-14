namespace FinTech.Modules.Notification.Application.Interfaces;

using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Primitives;
using FinTech.SharedKernel.Primitives;

public interface INotificationPreferenceRepository
{
    Task<NotificationPreference?> GetByIdAsync(NotificationPreferenceId id, CancellationToken ct = default);

    Task<NotificationPreference?> GetByUserIdAsync(UserId userId, CancellationToken ct = default);

    Task AddAsync(NotificationPreference preference, CancellationToken ct = default);

    void Update(NotificationPreference preference);

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}