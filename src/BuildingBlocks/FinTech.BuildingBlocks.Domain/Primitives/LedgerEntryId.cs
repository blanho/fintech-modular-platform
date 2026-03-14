namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct LedgerEntryId(Guid Value)
{
    public static LedgerEntryId New() => new(Guid.NewGuid());
    public static LedgerEntryId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;
    public override string ToString() => Value.ToString();

    public static implicit operator Guid(LedgerEntryId id) => id.Value;
    public static explicit operator LedgerEntryId(Guid id) => new(id);
}
