namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct WalletId(Guid Value)
{
    public static WalletId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static WalletId New()
    {
        return new WalletId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(WalletId id)
    {
        return id.Value;
    }

    public static explicit operator WalletId(Guid id)
    {
        return new WalletId(id);
    }
}
