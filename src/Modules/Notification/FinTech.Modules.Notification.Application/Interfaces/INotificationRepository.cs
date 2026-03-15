using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;

namespace FinTech.Modules.Notification.Application.Interfaces;

public interface INotificationRepository
{
    Task<Domain.Entities.Notification?> GetByIdAsync(NotificationId id, CancellationToken ct = default);

    Task<IReadOnlyList<Domain.Entities.Notification>> GetByUserIdAsync(
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

    Task<IReadOnlyList<Domain.Entities.Notification>> GetPendingAsync(int limit = 100, CancellationToken ct = default);

    Task<IReadOnlyList<Domain.Entities.Notification>> GetFailedForRetryAsync(int maxRetries = 3, int limit = 100,
        CancellationToken ct = default);

    Task AddAsync(Domain.Entities.Notification notification, CancellationToken ct = default);

    void Update(Domain.Entities.Notification notification);

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
