using System.Text.Json;
using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Infrastructure.Outbox;
using Microsoft.EntityFrameworkCore;

namespace FinTech.BuildingBlocks.Infrastructure.Persistence;

public abstract class BaseDbContext : DbContext
{
    protected BaseDbContext(DbContextOptions options)
        : base(options)
    {
    }

    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new OutboxMessageConfiguration());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();
        ConvertDomainEventsToOutboxMessages();

        var result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }

    private void SetTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
                if (entry.Entity.GetType().GetProperty("CreatedAt") is { } createdAtProp
                    && createdAtProp.PropertyType == typeof(DateTime))
                    createdAtProp.SetValue(entry.Entity, DateTime.UtcNow);

            if (entry.Entity.GetType().GetProperty("UpdatedAt") is { } updatedAtProp
                && updatedAtProp.PropertyType == typeof(DateTime?))
                updatedAtProp.SetValue(entry.Entity, DateTime.UtcNow);
        }
    }

    private void ConvertDomainEventsToOutboxMessages()
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
            var type = domainEvent.GetType().AssemblyQualifiedName!;
            var payload = JsonSerializer.Serialize(domainEvent, domainEvent.GetType());
            var outboxMessage = OutboxMessage.Create(type, payload);
            OutboxMessages.Add(outboxMessage);
        }
    }
}
