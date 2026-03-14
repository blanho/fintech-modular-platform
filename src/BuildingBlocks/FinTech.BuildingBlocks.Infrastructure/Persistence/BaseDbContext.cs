namespace FinTech.BuildingBlocks.Infrastructure.Persistence;

using FinTech.BuildingBlocks.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

public abstract class BaseDbContext : DbContext
{
    private readonly IPublisher _publisher;

    protected BaseDbContext(DbContextOptions options, IPublisher publisher)
        : base(options)
    {
        _publisher = publisher;
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();

        var result = await base.SaveChangesAsync(cancellationToken);

        await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private void SetTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.GetType().GetProperty("CreatedAt") is { } createdAtProp
                    && createdAtProp.PropertyType == typeof(DateTime))
                {
                    createdAtProp.SetValue(entry.Entity, DateTime.UtcNow);
                }
            }

            if (entry.Entity.GetType().GetProperty("UpdatedAt") is { } updatedAtProp
                && updatedAtProp.PropertyType == typeof(DateTime?))
            {
                updatedAtProp.SetValue(entry.Entity, DateTime.UtcNow);
            }
        }
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var domainEntities = ChangeTracker.Entries<Entity<Guid>>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = domainEntities
            .SelectMany(e => e.DomainEvents)
            .ToList();

        domainEntities.ForEach(e => e.ClearDomainEvents());

        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent, cancellationToken);
        }
    }
}
