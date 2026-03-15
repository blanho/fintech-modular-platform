namespace FinTech.Modules.Identity.Domain.ValueObjects;

public sealed record PasswordHash
{
    private PasswordHash(string value)
    {
        Value = value;
    }

    public string Value { get; }

    public static PasswordHash Create(string hashedValue)
    {
        if (string.IsNullOrWhiteSpace(hashedValue))
            throw new ArgumentException("Password hash cannot be empty", nameof(hashedValue));

        return new PasswordHash(hashedValue);
    }

    public override string ToString()
    {
        return "***";
    }
}
