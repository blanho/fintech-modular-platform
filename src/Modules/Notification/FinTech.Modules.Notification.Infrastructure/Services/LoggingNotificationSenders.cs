using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Notification.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Notification.Infrastructure.Services;

public class LoggingEmailSender : IEmailSender
{
    private readonly ILogger<LoggingEmailSender> _logger;

    public LoggingEmailSender(ILogger<LoggingEmailSender> logger)
    {
        _logger = logger;
    }

    public Task<Result> SendAsync(string to, string subject, string body, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "[EMAIL] To: {To} | Subject: {Subject} | Body: {Body}",
            to,
            subject,
            body.Length > 100 ? body[..100] + "..." : body);

        return Task.FromResult(Result.Success());
    }
}

public class LoggingPushNotificationSender : IPushNotificationSender
{
    private readonly ILogger<LoggingPushNotificationSender> _logger;

    public LoggingPushNotificationSender(ILogger<LoggingPushNotificationSender> logger)
    {
        _logger = logger;
    }

    public Task<Result> SendAsync(string deviceToken, string title, string body, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "[PUSH] DeviceToken: {DeviceToken} | Title: {Title} | Body: {Body}",
            deviceToken[..Math.Min(20, deviceToken.Length)] + "...",
            title,
            body.Length > 100 ? body[..100] + "..." : body);

        return Task.FromResult(Result.Success());
    }
}

public class LoggingSmsSender : ISmsSender
{
    private readonly ILogger<LoggingSmsSender> _logger;

    public LoggingSmsSender(ILogger<LoggingSmsSender> logger)
    {
        _logger = logger;
    }

    public Task<Result> SendAsync(string phoneNumber, string message, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "[SMS] To: {PhoneNumber} | Message: {Message}",
            phoneNumber,
            message.Length > 100 ? message[..100] + "..." : message);

        return Task.FromResult(Result.Success());
    }
}