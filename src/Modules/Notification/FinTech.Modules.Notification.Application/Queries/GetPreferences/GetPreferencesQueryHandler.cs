using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using MediatR;

namespace FinTech.Modules.Notification.Application.Queries.GetPreferences;

public sealed class GetPreferencesQueryHandler
    : IRequestHandler<GetPreferencesQuery, Result<PreferencesDto>>
{
    private readonly INotificationPreferenceRepository _repository;

    public GetPreferencesQueryHandler(INotificationPreferenceRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PreferencesDto>> Handle(
        GetPreferencesQuery request,
        CancellationToken cancellationToken)
    {
        var preferences = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);

        if (preferences == null)
        {
            var defaultResult = NotificationPreference.CreateDefault(request.UserId);
            if (defaultResult.IsFailure)
                return Result<PreferencesDto>.Failure(defaultResult.Error);

            preferences = defaultResult.Value!;
        }

        return Result<PreferencesDto>.Success(new PreferencesDto(
            preferences.Id.Value,
            preferences.EmailEnabled,
            preferences.PushEnabled,
            preferences.SmsEnabled,
            preferences.TransactionAlerts,
            preferences.SecurityAlerts,
            preferences.MarketingEnabled));
    }
}