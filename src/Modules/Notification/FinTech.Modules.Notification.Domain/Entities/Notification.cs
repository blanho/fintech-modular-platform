using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Notification.Domain.Enums;
using FinTech.Modules.Notification.Domain.Events;
using FinTech.Modules.Notification.Domain.Primitives;

namespace FinTech.Modules.Notification.Domain.Entities;

public sealed class Notification : AggregateRoot<NotificationId>
{
    private Notification()
    {
    }

    public UserId UserId { get; private set; }
    public NotificationType Type { get; private set; }
    public NotificationCategory Category { get; private set; }
    public NotificationStatus Status { get; private set; }
    public string Subject { get; private set; } = null!;
    public string Body { get; private set; } = null!;
    public string? Recipient { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime? SentAt { get; private set; }
    public int RetryCount { get; private set; }
    public Guid? ReferenceId { get; private set; }
    public string? ReferenceType { get; private set; }

    public static Result<Notification> Create(
        UserId userId,
        NotificationType type,
        NotificationCategory category,
        string subject,
        string body,
        string? recipient = null,
        Guid? referenceId = null,
        string? referenceType = null)
    {
        if (userId.IsEmpty)
            return Result<Notification>.Failure(Error.Validation("User ID is required"));

        if (string.IsNullOrWhiteSpace(subject))
            return Result<Notification>.Failure(Error.Validation("Subject is required"));

        if (string.IsNullOrWhiteSpace(body))
            return Result<Notification>.Failure(Error.Validation("Body is required"));

        var notification = new Notification
        {
            Id = NotificationId.New(),
            UserId = userId,
            Type = type,
            Category = category,
            Status = NotificationStatus.Pending,
            Subject = subject.Trim(),
            Body = body.Trim(),
            Recipient = recipient?.Trim(),
            ReferenceId = referenceId,
            ReferenceType = referenceType,
            RetryCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        return Result<Notification>.Success(notification);
    }

    public Result MarkAsSent()
    {
        if (Status != NotificationStatus.Pending)
            return Result.Failure(Error.Conflict($"Cannot mark notification as sent when status is {Status}"));

        Status = NotificationStatus.Sent;
        SentAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new NotificationSentEvent(Id, UserId, Type, Category, SentAt.Value));

        return Result.Success();
    }

    public Result MarkAsFailed(string errorMessage)
    {
        if (Status == NotificationStatus.Sent || Status == NotificationStatus.Cancelled)
            return Result.Failure(Error.Conflict($"Cannot mark notification as failed when status is {Status}"));

        if (string.IsNullOrWhiteSpace(errorMessage))
            return Result.Failure(Error.Validation("Error message is required"));

        Status = NotificationStatus.Failed;
        ErrorMessage = errorMessage.Trim();
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new NotificationFailedEvent(Id, UserId, Type, ErrorMessage, DateTime.UtcNow));

        return Result.Success();
    }

    public Result Cancel()
    {
        if (Status != NotificationStatus.Pending)
            return Result.Failure(Error.Conflict($"Cannot cancel notification when status is {Status}"));

        Status = NotificationStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public Result Retry(int maxRetries = 3)
    {
        if (Status != NotificationStatus.Failed)
            return Result.Failure(Error.Conflict("Can only retry failed notifications"));

        if (RetryCount >= maxRetries)
            return Result.Failure(Error.Conflict($"Maximum retry count ({maxRetries}) exceeded"));

        RetryCount++;
        Status = NotificationStatus.Pending;
        ErrorMessage = null;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }
}