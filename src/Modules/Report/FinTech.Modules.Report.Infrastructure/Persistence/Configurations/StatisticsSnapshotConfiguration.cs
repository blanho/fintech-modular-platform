using FinTech.Modules.Report.Domain.Entities;
using FinTech.Modules.Report.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Report.Infrastructure.Persistence.Configurations;

internal sealed class StatisticsSnapshotConfiguration : IEntityTypeConfiguration<StatisticsSnapshot>
{
    public void Configure(EntityTypeBuilder<StatisticsSnapshot> builder)
    {
        builder.ToTable("statistics_snapshots");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.MetricType)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.Value)
            .HasPrecision(18, 4)
            .IsRequired();

        builder.Property(s => s.RecordedAt)
            .IsRequired();

        builder.Property(s => s.Granularity)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(s => s.Dimension)
            .HasMaxLength(100);

        builder.Property(s => s.Metadata)
            .HasColumnType("jsonb");

        builder.HasIndex(s => new { s.MetricType, s.RecordedAt });
        builder.HasIndex(s => new { s.MetricType, s.Granularity, s.RecordedAt });
        builder.HasIndex(s => s.RecordedAt);
    }
}
