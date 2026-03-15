using FinTech.Modules.BackgroundJob.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.BackgroundJob.Infrastructure.Persistence;

public class BackgroundJobDbContext : DbContext
{
    public BackgroundJobDbContext(DbContextOptions<BackgroundJobDbContext> options)
        : base(options)
    {
    }

    public DbSet<Job> Jobs => Set<Job>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("background_job");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BackgroundJobDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
