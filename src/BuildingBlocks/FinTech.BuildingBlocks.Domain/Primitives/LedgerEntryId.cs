namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct LedgerEntryId(Guid Value)
{
    public static LedgerEntryId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static LedgerEntryId New()
    {
        return new LedgerEntryId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(LedgerEntryId id)
    {
        return id.Value;
    }

    public static explicit operator LedgerEntryId(Guid id)
    {
        return new LedgerEntryId(id);
    }
}
