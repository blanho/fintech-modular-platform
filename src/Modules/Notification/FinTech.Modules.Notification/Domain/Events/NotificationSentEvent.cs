namespace FinTech.Modules.Notification.Domain.Events;

using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;
using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record NotificationSentEvent(
    NotificationId NotificationId,
    UserId UserId,
    NotificationType Type,
    NotificationCategory Category,
    DateTime SentAt) : DomainEventBase;