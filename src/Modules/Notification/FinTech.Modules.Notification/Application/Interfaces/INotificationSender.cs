namespace FinTech.Modules.Notification.Application.Interfaces;

using FinTech.Modules.Notification.Domain.Entities;
using FinTech.SharedKernel.Results;

public interface INotificationSender
{

Task<Result> SendAsync(Notification notification, CancellationToken ct = default);
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