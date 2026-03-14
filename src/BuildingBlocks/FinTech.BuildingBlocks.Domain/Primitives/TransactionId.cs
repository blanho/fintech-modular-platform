namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct TransactionId(Guid Value)
{
    public static TransactionId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static TransactionId New()
    {
        return new TransactionId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(TransactionId id)
    {
        return id.Value;
    }

    public static explicit operator TransactionId(Guid id)
    {
        return new TransactionId(id);
    }
}