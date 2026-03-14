namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct WalletId(Guid Value)
{
    public static WalletId New() => new(Guid.NewGuid());
    public static WalletId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;
    public override string ToString() => Value.ToString();

    public static implicit operator Guid(WalletId id) => id.Value;
    public static explicit operator WalletId(Guid id) => new(id);
}
