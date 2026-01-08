namespace FinTech.Modules.Notification.Application.Commands.UpdatePreferences;

using FinTech.Modules.Notification.Application.Interfaces;
using FinTech.Modules.Notification.Domain.Entities;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed class UpdatePreferencesCommandHandler
    : IRequestHandler<UpdatePreferencesCommand, Result<UpdatePreferencesResponse>>
{
    private readonly INotificationPreferenceRepository _repository;

    public UpdatePreferencesCommandHandler(INotificationPreferenceRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<UpdatePreferencesResponse>> Handle(
        UpdatePreferencesCommand request,
        CancellationToken cancellationToken)
    {

        var preferences = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);

        if (preferences == null)
        {

            var createResult = NotificationPreference.CreateDefault(request.UserId);
            if (createResult.IsFailure)
                return Result<UpdatePreferencesResponse>.Failure(createResult.Error);

            preferences = createResult.Value!;
            await _repository.AddAsync(preferences, cancellationToken);
        }

var updateResult = preferences.Update(
            request.EmailEnabled,
            request.PushEnabled,
            request.SmsEnabled,
            request.TransactionAlerts,
            request.SecurityAlerts,
            request.MarketingEnabled);

        if (updateResult.IsFailure)
            return Result<UpdatePreferencesResponse>.Failure(updateResult.Error);

        await _repository.SaveChangesAsync(cancellationToken);

        return Result<UpdatePreferencesResponse>.Success(new UpdatePreferencesResponse(
            preferences.Id.Value,
            preferences.EmailEnabled,
            preferences.PushEnabled,
            preferences.SmsEnabled,
            preferences.TransactionAlerts,
            preferences.SecurityAlerts,
            preferences.MarketingEnabled,
            preferences.UpdatedAt ?? preferences.CreatedAt));
    }
}