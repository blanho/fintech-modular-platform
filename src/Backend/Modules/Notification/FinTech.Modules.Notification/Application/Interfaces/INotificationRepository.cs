namespace FinTech.Modules.Notification.Application.Interfaces;

using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;
using FinTech.SharedKernel.Primitives;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(NotificationId id, CancellationToken ct = default);

    Task<IReadOnlyList<Notification>> GetByUserIdAsync(
        UserId userId,
        NotificationStatus? status = null,
        NotificationCategory? category = null,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default);

    Task<int> GetCountByUserIdAsync(
        UserId userId,
        NotificationStatus? status = null,
        NotificationCategory? category = null,
        CancellationToken ct = default);

    Task<IReadOnlyList<Notification>> GetPendingAsync(int limit = 100, CancellationToken ct = default);

    Task<IReadOnlyList<Notification>> GetFailedForRetryAsync(int maxRetries = 3, int limit = 100, CancellationToken ct = default);

    Task AddAsync(Notification notification, CancellationToken ct = default);

    void Update(Notification notification);

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}