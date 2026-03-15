namespace FinTech.BuildingBlocks.Domain.Primitives;

public readonly record struct UserId(Guid Value)
{
    public static UserId Empty => new(Guid.Empty);
    public bool IsEmpty => Value == Guid.Empty;

    public static UserId New()
    {
        return new UserId(Guid.NewGuid());
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static implicit operator Guid(UserId id)
    {
        return id.Value;
    }

    public static explicit operator UserId(Guid id)
    {
        return new UserId(id);
    }
}
