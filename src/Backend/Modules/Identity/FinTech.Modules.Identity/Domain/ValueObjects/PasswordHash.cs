namespace FinTech.Modules.Identity.Domain.ValueObjects;

public sealed record PasswordHash
{
    public string Value { get; }

    private PasswordHash(string value) => Value = value;

public static PasswordHash Create(string hashedValue)
    {
        if (string.IsNullOrWhiteSpace(hashedValue))
            throw new ArgumentException("Password hash cannot be empty", nameof(hashedValue));

        return new PasswordHash(hashedValue);
    }

    public override string ToString() => "***";
}