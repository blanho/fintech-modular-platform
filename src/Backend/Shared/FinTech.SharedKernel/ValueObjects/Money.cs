namespace FinTech.SharedKernel.ValueObjects;

using FinTech.SharedKernel.Results;

public sealed record Money
{

public decimal Amount { get; }

public Currency Currency { get; }

    private Money(decimal amount, Currency currency)
    {

        Amount = decimal.Round(amount, 4, MidpointRounding.ToEven);
        Currency = currency;
    }

public static Result<Money> Create(decimal amount, string currencyCode)
    {
        var currencyResult = Currency.FromCode(currencyCode);
        if (currencyResult.IsFailure)
            return Result<Money>.Failure(currencyResult.Error);

        return Result<Money>.Success(new Money(amount, currencyResult.Value!));
    }

public static Result<Money> Create(decimal amount, Currency currency)
    {
        return Result<Money>.Success(new Money(amount, currency));
    }

public static Money Zero(Currency currency) => new(0m, currency);

public Money Add(Money other)
    {
        EnsureSameCurrency(other);
        return new Money(Amount + other.Amount, Currency);
    }

public Money Subtract(Money other)
    {
        EnsureSameCurrency(other);
        return new Money(Amount - other.Amount, Currency);
    }

public Money Negate() => new(-Amount, Currency);

public Money Abs() => new(Math.Abs(Amount), Currency);

public bool IsNegative => Amount < 0;

public bool IsPositive => Amount > 0;

public bool IsZero => Amount == 0;

public bool IsGreaterThan(Money other)
    {
        EnsureSameCurrency(other);
        return Amount > other.Amount;
    }

public bool IsGreaterThanOrEqual(Money other)
    {
        EnsureSameCurrency(other);
        return Amount >= other.Amount;
    }

public bool IsLessThan(Money other)
    {
        EnsureSameCurrency(other);
        return Amount < other.Amount;
    }

public bool IsLessThanOrEqual(Money other)
    {
        EnsureSameCurrency(other);
        return Amount <= other.Amount;
    }

    private void EnsureSameCurrency(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException(
                $"Cannot operate on different currencies: {Currency} and {other.Currency}");
    }

    public override string ToString() => $"{Amount:F4} {Currency}";
}