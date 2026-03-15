using FinTech.Modules.Audit.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Audit.Infrastructure.Persistence.Configurations;

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.UserId)
            .HasColumnName("user_id");

        builder.Property(x => x.Action)
            .HasColumnName("action")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.ActionType)
            .HasColumnName("action_type")
            .IsRequired();

        builder.Property(x => x.ResourceType)
            .HasColumnName("resource_type")
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(x => x.ResourceId)
            .HasColumnName("resource_id")
            .HasMaxLength(128);

        builder.Property(x => x.IsSuccess)
            .HasColumnName("is_success")
            .IsRequired();

        builder.Property(x => x.ErrorMessage)
            .HasColumnName("error_message")
            .HasMaxLength(2000);

        builder.Property(x => x.DurationMs)
            .HasColumnName("duration_ms")
            .IsRequired();

        builder.Property(x => x.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(x => x.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(512);

        builder.Property(x => x.CorrelationId)
            .HasColumnName("correlation_id")
            .HasMaxLength(64);

        builder.Property(x => x.Timestamp)
            .HasColumnName("timestamp")
            .IsRequired();

        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("ix_audit_logs_user_id");

        builder.HasIndex(x => x.ActionType)
            .HasDatabaseName("ix_audit_logs_action_type");

        builder.HasIndex(x => x.ResourceType)
            .HasDatabaseName("ix_audit_logs_resource_type");

        builder.HasIndex(x => x.Timestamp)
            .IsDescending()
            .HasDatabaseName("ix_audit_logs_timestamp");

        builder.HasIndex(x => x.CorrelationId)
            .HasDatabaseName("ix_audit_logs_correlation_id");
    }
}
