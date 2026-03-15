using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Notification.Domain.Primitives;

namespace FinTech.Modules.Notification.Domain.Entities;

public sealed class NotificationPreference : AggregateRoot<NotificationPreferenceId>
{
    private NotificationPreference()
    {
    }

    public UserId UserId { get; private set; }
    public bool EmailEnabled { get; private set; }
    public bool PushEnabled { get; private set; }
    public bool SmsEnabled { get; private set; }
    public bool TransactionAlerts { get; private set; }
    public bool SecurityAlerts { get; private set; }
    public bool MarketingEnabled { get; private set; }

    public static Result<NotificationPreference> CreateDefault(UserId userId)
    {
        if (userId.IsEmpty)
            return Result<NotificationPreference>.Failure(Error.Validation("User ID is required"));

        var preferences = new NotificationPreference
        {
            Id = NotificationPreferenceId.New(),
            UserId = userId,
            EmailEnabled = true,
            PushEnabled = true,
            SmsEnabled = false,
            TransactionAlerts = true,
            SecurityAlerts = true,
            MarketingEnabled = false,
            CreatedAt = DateTime.UtcNow
        };

        return Result<NotificationPreference>.Success(preferences);
    }

    public Result Update(
        bool emailEnabled,
        bool pushEnabled,
        bool smsEnabled,
        bool transactionAlerts,
        bool securityAlerts,
        bool marketingEnabled)
    {
        EmailEnabled = emailEnabled;
        PushEnabled = pushEnabled;
        SmsEnabled = smsEnabled;
        TransactionAlerts = transactionAlerts;
        SecurityAlerts = securityAlerts;
        MarketingEnabled = marketingEnabled;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public void EnableEmail()
    {
        EmailEnabled = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DisableEmail()
    {
        EmailEnabled = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void EnablePush()
    {
        PushEnabled = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DisablePush()
    {
        PushEnabled = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
