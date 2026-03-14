namespace FinTech.SharedKernel.ValueObjects;

using FinTech.SharedKernel.Results;

public sealed record Currency
{
    private static readonly HashSet<string> SupportedCurrencies = new()
    {
        "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "SGD"
    };

public string Code { get; }

    private Currency(string code) => Code = code;

public static Result<Currency> FromCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return Result<Currency>.Failure(Error.Validation("Currency code is required"));

        var normalized = code.ToUpperInvariant().Trim();

        if (normalized.Length != 3)
            return Result<Currency>.Failure(Error.Validation("Currency code must be 3 characters"));

        if (!SupportedCurrencies.Contains(normalized))
            return Result<Currency>.Failure(
                Error.Validation($"Currency '{code}' is not supported. Supported: {string.Join(", ", SupportedCurrencies)}"));

        return Result<Currency>.Success(new Currency(normalized));
    }

public static Currency USD => new("USD");
    public static Currency EUR => new("EUR");
    public static Currency GBP => new("GBP");
    public static Currency JPY => new("JPY");
    public static Currency CHF => new("CHF");
    public static Currency CAD => new("CAD");
    public static Currency AUD => new("AUD");
    public static Currency SGD => new("SGD");

public static IReadOnlySet<string> GetSupportedCurrencies() => SupportedCurrencies;

    public override string ToString() => Code;
}