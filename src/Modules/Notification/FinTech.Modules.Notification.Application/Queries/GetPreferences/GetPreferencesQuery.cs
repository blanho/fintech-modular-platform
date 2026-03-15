using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Notification.Application.Queries.GetPreferences;

public sealed record GetPreferencesQuery(UserId UserId) : IRequest<Result<PreferencesDto>>;

public sealed record PreferencesDto(
    Guid PreferenceId,
    bool EmailEnabled,
    bool PushEnabled,
    bool SmsEnabled,
    bool TransactionAlerts,
    bool SecurityAlerts,
    bool MarketingEnabled);
