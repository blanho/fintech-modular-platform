namespace FinTech.Modules.Notification.Domain.Primitives;

public readonly record struct NotificationId(Guid Value)
{
    public static NotificationId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static NotificationId New()
    {
        return new NotificationId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(NotificationId id)
    {
        return id.Value;
    }

    public static explicit operator NotificationId(Guid id)
    {
        return new NotificationId(id);
    }
}
