namespace FinTech.Modules.Identity.Domain.Entities;

using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Domain.Enums;
using FinTech.Modules.Identity.Domain.ValueObjects;
using FinTech.Modules.Identity.Domain.Events;

public sealed class User : AggregateRoot<UserId>
{
    public Email Email { get; private set; } = null!;
    public PasswordHash PasswordHash { get; private set; } = null!;
    public UserStatus Status { get; private set; }
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    private User() { }

public static Result<User> Create(
        Email email,
        PasswordHash passwordHash,
        string? firstName = null,
        string? lastName = null)
    {
        var user = new User
        {
            Id = UserId.New(),
            Email = email,
            PasswordHash = passwordHash,
            FirstName = firstName?.Trim(),
            LastName = lastName?.Trim(),
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        user.RaiseDomainEvent(new UserCreatedEvent(user.Id, user.Email.Value));

        return Result<User>.Success(user);
    }

public Result UpdateProfile(string? firstName, string? lastName)
    {
        FirstName = firstName?.Trim();
        LastName = lastName?.Trim();
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

public Result ChangePassword(PasswordHash newPasswordHash)
    {
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new UserPasswordChangedEvent(Id));

        return Result.Success();
    }

public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
    }

public Result Deactivate()
    {
        if (Status == UserStatus.Deactivated)
            return Result.Failure(Error.Conflict("User is already deactivated"));

        Status = UserStatus.Deactivated;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new UserDeactivatedEvent(Id));

        return Result.Success();
    }

public Result Activate()
    {
        if (Status == UserStatus.Active)
            return Result.Failure(Error.Conflict("User is already active"));

        Status = UserStatus.Active;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

public string FullName => $"{FirstName} {LastName}".Trim();

public bool IsActive => Status == UserStatus.Active;
}