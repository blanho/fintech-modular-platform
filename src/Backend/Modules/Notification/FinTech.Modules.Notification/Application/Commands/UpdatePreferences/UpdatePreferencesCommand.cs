namespace FinTech.Modules.Notification.Application.Commands.UpdatePreferences;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed record UpdatePreferencesCommand(
    UserId UserId,
    bool EmailEnabled,
    bool PushEnabled,
    bool SmsEnabled,
    bool TransactionAlerts,
    bool SecurityAlerts,
    bool MarketingEnabled) : IRequest<Result<UpdatePreferencesResponse>>;

public sealed record UpdatePreferencesResponse(
    Guid PreferenceId,
    bool EmailEnabled,
    bool PushEnabled,
    bool SmsEnabled,
    bool TransactionAlerts,
    bool SecurityAlerts,
    bool MarketingEnabled,
    DateTime UpdatedAt);