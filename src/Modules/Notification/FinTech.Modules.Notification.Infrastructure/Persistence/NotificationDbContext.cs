using FinTech.BuildingBlocks.Domain;
using FinTech.Modules.Notification.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Notification.Infrastructure.Persistence;

public class NotificationDbContext : DbContext
{
    private readonly IMediator _mediator;

    public NotificationDbContext(DbContextOptions<NotificationDbContext> options, IMediator mediator)
        : base(options)
    {
        _mediator = mediator;
    }

    public DbSet<Domain.Entities.Notification> Notifications => Set<Domain.Entities.Notification>();
    public DbSet<NotificationPreference> NotificationPreferences => Set<NotificationPreference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("notification");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NotificationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);
        await DispatchDomainEventsAsync(cancellationToken);
        return result;
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var domainEntities = ChangeTracker.Entries<Entity<object>>()
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