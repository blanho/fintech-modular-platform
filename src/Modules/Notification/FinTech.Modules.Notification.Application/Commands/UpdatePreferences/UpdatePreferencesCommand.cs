using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Notification.Application.Commands.UpdatePreferences;

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