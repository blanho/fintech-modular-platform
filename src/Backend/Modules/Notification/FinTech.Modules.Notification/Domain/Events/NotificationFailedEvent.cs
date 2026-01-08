namespace FinTech.Modules.Notification.Domain.Events;

using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Primitives;
using FinTech.SharedKernel.Domain;
using FinTech.SharedKernel.Primitives;

public sealed record NotificationFailedEvent(
    NotificationId NotificationId,
    UserId UserId,
    NotificationType Type,
    string FailureReason,
    DateTime FailedAt) : DomainEventBase;