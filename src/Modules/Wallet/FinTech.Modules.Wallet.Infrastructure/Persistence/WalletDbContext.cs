using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Wallet.Infrastructure.Persistence;

public sealed class WalletDbContext : DbContext
{
    private readonly IMediator _mediator;

    public WalletDbContext(
        DbContextOptions<WalletDbContext> options,
        IMediator mediator) : base(options)
    {
        _mediator = mediator;
    }

    public DbSet<Domain.Entities.Wallet> Wallets => Set<Domain.Entities.Wallet>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("wallet");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WalletDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AggregateRoot<WalletId>>())
            if (entry.State == EntityState.Modified)
                entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;

        var result = await base.SaveChangesAsync(cancellationToken);

        await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var domainEntities = ChangeTracker.Entries<Entity<WalletId>>()
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
