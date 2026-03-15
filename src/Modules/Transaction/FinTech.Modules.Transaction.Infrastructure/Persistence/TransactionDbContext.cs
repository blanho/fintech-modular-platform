using FinTech.BuildingBlocks.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Transaction.Infrastructure.Persistence;

public class TransactionDbContext : DbContext
{
    private readonly IMediator _mediator;

    public TransactionDbContext(DbContextOptions<TransactionDbContext> options, IMediator mediator)
        : base(options)
    {
        _mediator = mediator;
    }

    public DbSet<Domain.Entities.Transaction> Transactions => Set<Domain.Entities.Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("transaction");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TransactionDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AggregateRoot<object>>())
            if (entry.State == EntityState.Added)
                entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
            else if (entry.State == EntityState.Modified) entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;

        var result = await base.SaveChangesAsync(cancellationToken);

        await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var domainEntities = ChangeTracker
            .Entries<Entity<object>>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = domainEntities
            .SelectMany(e => e.DomainEvents)
            .ToList();

        domainEntities.ForEach(e => e.ClearDomainEvents());

        foreach (var domainEvent in domainEvents) await _mediator.Publish(domainEvent, cancellationToken);
    }
}
