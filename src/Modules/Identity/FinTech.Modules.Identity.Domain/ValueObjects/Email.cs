namespace FinTech.Modules.Identity.Domain.ValueObjects;

using FinTech.BuildingBlocks.Domain.Results;

public sealed record Email
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result<Email>.Failure(Error.Validation("Email is required"));

        email = email.Trim().ToLowerInvariant();

        if (email.Length > 255)
            return Result<Email>.Failure(Error.Validation("Email is too long (max 255 characters)"));

        if (!IsValidEmail(email))
            return Result<Email>.Failure(Error.Validation("Invalid email format"));

        return Result<Email>.Success(new Email(email));
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        var atIndex = email.IndexOf('@');
        if (atIndex <= 0)
            return false;

        var dotIndex = email.LastIndexOf('.');
        if (dotIndex <= atIndex + 1)
            return false;

        if (dotIndex >= email.Length - 1)
            return false;

if (email.Contains(".."))
            return false;

        return true;
    }

    public override string ToString() => Value;
}