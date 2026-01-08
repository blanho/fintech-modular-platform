namespace FinTech.Modules.Notification.Domain.Primitives;

public readonly record struct NotificationId(Guid Value)
{
    public static NotificationId New() => new(Guid.NewGuid());
    public static NotificationId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;
    public override string ToString() => Value.ToString();

    public static implicit operator Guid(NotificationId id) => id.Value;
    public static explicit operator NotificationId(Guid id) => new(id);
}