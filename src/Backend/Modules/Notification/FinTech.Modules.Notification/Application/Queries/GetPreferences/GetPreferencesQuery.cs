namespace FinTech.Modules.Notification.Application.Queries.GetPreferences;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed record GetPreferencesQuery(UserId UserId) : IRequest<Result<PreferencesDto>>;

public sealed record PreferencesDto(
    Guid PreferenceId,
    bool EmailEnabled,
    bool PushEnabled,
    bool SmsEnabled,
    bool TransactionAlerts,
    bool SecurityAlerts,
    bool MarketingEnabled);