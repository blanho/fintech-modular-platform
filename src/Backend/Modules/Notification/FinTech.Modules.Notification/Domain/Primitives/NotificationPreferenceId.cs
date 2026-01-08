namespace FinTech.Modules.Notification.Domain.Primitives;

public readonly record struct NotificationPreferenceId(Guid Value)
{
    public static NotificationPreferenceId New() => new(Guid.NewGuid());
    public static NotificationPreferenceId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;
    public override string ToString() => Value.ToString();

    public static implicit operator Guid(NotificationPreferenceId id) => id.Value;
    public static explicit operator NotificationPreferenceId(Guid id) => new(id);
}