using FinTech.BuildingBlocks.Domain.Results;

namespace FinTech.Modules.Notification.Application.Interfaces;

public interface INotificationSender
{
    Task<Result> SendAsync(Domain.Entities.Notification notification, CancellationToken ct = default);
}

public interface IEmailSender
{
    Task<Result> SendAsync(string to, string subject, string body, CancellationToken ct = default);
}

public interface IPushNotificationSender
{
    Task<Result> SendAsync(string deviceToken, string title, string body, CancellationToken ct = default);
}

public interface ISmsSender
{
    Task<Result> SendAsync(string phoneNumber, string message, CancellationToken ct = default);
}