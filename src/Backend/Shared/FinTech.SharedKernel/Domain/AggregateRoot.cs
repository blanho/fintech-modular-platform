namespace FinTech.SharedKernel.Domain;

public abstract class AggregateRoot<TId> : Entity<TId> where TId : notnull
{

public DateTime CreatedAt { get; protected set; }

public DateTime? UpdatedAt { get; protected set; }

protected void SetCreatedAt()
    {
        CreatedAt = DateTime.UtcNow;
    }

protected void SetUpdatedAt()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}