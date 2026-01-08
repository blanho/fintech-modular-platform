namespace FinTech.Infrastructure.Persistence;

using FinTech.SharedKernel.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

public abstract class BaseDbContext : DbContext
{
    private readonly IMediator _mediator;

    protected BaseDbContext(DbContextOptions options, IMediator mediator) : base(options)
    {
        _mediator = mediator;
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {

        UpdateTimestamps();

var result = await base.SaveChangesAsync(cancellationToken);

await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {

            var entityType = entry.Entity.GetType();

            if (entry.State == EntityState.Added)
            {
                var createdAtProperty = entityType.GetProperty("CreatedAt");
                if (createdAtProperty != null && createdAtProperty.CanWrite)
                {
                    var currentValue = createdAtProperty.GetValue(entry.Entity);
                    if (currentValue is DateTime dt && dt == default)
                    {
                        createdAtProperty.SetValue(entry.Entity, now);
                    }
                }
            }

            if (entry.State == EntityState.Modified)
            {
                var updatedAtProperty = entityType.GetProperty("UpdatedAt");
                if (updatedAtProperty != null && updatedAtProperty.CanWrite)
                {
                    updatedAtProperty.SetValue(entry.Entity, now);
                }
            }
        }
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {

        var domainEntities = ChangeTracker.Entries()
            .Where(e => e.Entity is IHasDomainEvents)
            .Select(e => (IHasDomainEvents)e.Entity)
            .Where(e => e.DomainEvents.Any())
            .ToList();

var domainEvents = domainEntities
            .SelectMany(e => e.DomainEvents)
            .ToList();

domainEntities.ForEach(e => e.ClearDomainEvents());

foreach (var domainEvent in domainEvents)
        {
            await _mediator.Publish(domainEvent, cancellationToken);
        }
    }
}

public interface IHasDomainEvents
{
    IReadOnlyList<IDomainEvent> DomainEvents { get; }
    void ClearDomainEvents();
}