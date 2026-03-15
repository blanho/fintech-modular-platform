using FinTech.Modules.Report.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Report.Infrastructure.Persistence;

public sealed class ReportDbContext : DbContext
{
    public const string Schema = "report";

    public ReportDbContext(DbContextOptions<ReportDbContext> options) : base(options) { }

    public DbSet<Domain.Entities.Report> Reports => Set<Domain.Entities.Report>();
    public DbSet<StatisticsSnapshot> StatisticsSnapshots => Set<StatisticsSnapshot>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ReportDbContext).Assembly);
    }
}
