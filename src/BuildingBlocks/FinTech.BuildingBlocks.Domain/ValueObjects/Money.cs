using FinTech.BuildingBlocks.Domain.Results;

namespace FinTech.BuildingBlocks.Domain.ValueObjects;

public sealed record Money
{
    private Money(decimal amount, Currency currency)
    {
        Amount = decimal.Round(amount, 4, MidpointRounding.ToEven);
        Currency = currency;
    }

    public decimal Amount { get; }

    public Currency Currency { get; }

    public bool IsNegative => Amount < 0;

    public bool IsPositive => Amount > 0;

    public bool IsZero => Amount == 0;

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

    public static Money Zero(Currency currency)
    {
        return new Money(0m, currency);
    }

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

    public Money Negate()
    {
        return new Money(-Amount, Currency);
    }

    public Money Abs()
    {
        return new Money(Math.Abs(Amount), Currency);
    }

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

    public override string ToString()
    {
        return $"{Amount:F4} {Currency}";
    }
}