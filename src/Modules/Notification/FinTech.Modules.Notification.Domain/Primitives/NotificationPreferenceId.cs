namespace FinTech.Modules.Notification.Domain.Primitives;

public readonly record struct NotificationPreferenceId(Guid Value)
{
    public static NotificationPreferenceId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static NotificationPreferenceId New()
    {
        return new NotificationPreferenceId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(NotificationPreferenceId id)
    {
        return id.Value;
    }

    public static explicit operator NotificationPreferenceId(Guid id)
    {
        return new NotificationPreferenceId(id);
    }
}