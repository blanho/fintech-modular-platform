using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;

namespace FinTech.Modules.Notification.Domain.Events;

public sealed record NotificationSentEvent(
    NotificationId NotificationId,
    UserId UserId,
    NotificationType Type,
    NotificationCategory Category,
    DateTime SentAt) : DomainEventBase;