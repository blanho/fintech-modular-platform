namespace FinTech.Modules.Ledger.Infrastructure.Persistence;

using FinTech.Modules.Ledger.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class LedgerDbContext : DbContext
{
    private readonly IMediator _mediator;

    public LedgerDbContext(DbContextOptions<LedgerDbContext> options, IMediator mediator)
        : base(options)
    {
        _mediator = mediator;
    }

    public DbSet<LedgerEntry> LedgerEntries => Set<LedgerEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("ledger");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LedgerDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {

        var modifiedEntries = ChangeTracker.Entries<LedgerEntry>()
            .Where(e => e.State == EntityState.Modified || e.State == EntityState.Deleted)
            .ToList();

        if (modifiedEntries.Any())
        {
            throw new InvalidOperationException(
                "Ledger entries are immutable and cannot be modified or deleted. " +
                "To correct an error, create a reversal entry instead.");
        }

        var result = await base.SaveChangesAsync(cancellationToken);

await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var domainEntities = ChangeTracker.Entries<LedgerEntry>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
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