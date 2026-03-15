using FinTech.Modules.BackgroundJob.Domain.Entities;
using FinTech.Modules.BackgroundJob.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.BackgroundJob.Infrastructure.Persistence.Configurations;

public sealed class JobConfiguration : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.ToTable("jobs");

        builder.HasKey(j => j.Id);

        builder.Property(j => j.Id)
            .HasColumnName("id");

        builder.Property(j => j.JobType)
            .HasColumnName("job_type")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(j => j.Payload)
            .HasColumnName("payload")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(j => j.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(j => j.ProgressPercentage)
            .HasColumnName("progress_percentage")
            .HasDefaultValue(0);

        builder.Property(j => j.ResultPayload)
            .HasColumnName("result_payload")
            .HasColumnType("jsonb");

        builder.Property(j => j.ErrorMessage)
            .HasColumnName("error_message")
            .HasMaxLength(2000);

        builder.Property(j => j.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(j => j.StartedAt)
            .HasColumnName("started_at");

        builder.Property(j => j.CompletedAt)
            .HasColumnName("completed_at");

        builder.Property(j => j.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(j => j.RetryCount)
            .HasColumnName("retry_count")
            .HasDefaultValue(0);

        builder.Property(j => j.MaxRetries)
            .HasColumnName("max_retries")
            .HasDefaultValue(3);

        builder.Property(j => j.IsCancellationRequested)
            .HasColumnName("is_cancellation_requested")
            .HasDefaultValue(false);

        builder.HasIndex(j => j.Status);
        builder.HasIndex(j => j.JobType);
        builder.HasIndex(j => j.CreatedAt).IsDescending();
        builder.HasIndex(j => new { j.Status, j.CreatedAt });
    }
}
