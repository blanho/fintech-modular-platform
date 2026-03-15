using FinTech.Modules.Report.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Report.Infrastructure.Persistence.Configurations;

internal sealed class ReportConfiguration : IEntityTypeConfiguration<Domain.Entities.Report>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Report> builder)
    {
        builder.ToTable("reports");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(r => r.Type)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(r => r.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(r => r.RequestedByUserId)
            .IsRequired();

        builder.Property(r => r.PeriodStart)
            .IsRequired();

        builder.Property(r => r.PeriodEnd)
            .IsRequired();

        builder.Property(r => r.Parameters)
            .HasColumnType("jsonb");

        builder.Property(r => r.ResultData)
            .HasColumnType("jsonb");

        builder.Property(r => r.ErrorMessage)
            .HasMaxLength(2000);

        builder.HasIndex(r => r.RequestedByUserId);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => new { r.RequestedByUserId, r.CreatedAt });
        builder.HasIndex(r => new { r.Status, r.CreatedAt });
    }
}
