namespace FinTech.SharedKernel.Primitives;

public readonly record struct TransactionId(Guid Value)
{
    public static TransactionId New() => new(Guid.NewGuid());
    public static TransactionId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;
    public override string ToString() => Value.ToString();

    public static implicit operator Guid(TransactionId id) => id.Value;
    public static explicit operator TransactionId(Guid id) => new(id);
}