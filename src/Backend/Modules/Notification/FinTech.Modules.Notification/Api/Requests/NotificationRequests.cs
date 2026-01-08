namespace FinTech.Modules.Notification.Api.Requests;

public sealed record UpdatePreferencesRequest(
    bool EmailEnabled,
    bool PushEnabled,
    bool SmsEnabled,
    bool TransactionAlerts,
    bool SecurityAlerts,
    bool MarketingEnabled);