using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Notification.Domain.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Notification.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Domain.Entities.Notification>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new NotificationId(value));

        builder.Property(n => n.UserId)
            .HasColumnName("user_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new UserId(value));

        builder.Property(n => n.Type)
            .HasColumnName("type")
            .IsRequired();

        builder.Property(n => n.Category)
            .HasColumnName("category")
            .IsRequired();

        builder.Property(n => n.Status)
            .HasColumnName("status")
            .IsRequired();

        builder.Property(n => n.Subject)
            .HasColumnName("subject")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(n => n.Body)
            .HasColumnName("body")
            .IsRequired();

        builder.Property(n => n.Recipient)
            .HasColumnName("recipient")
            .HasMaxLength(255);

        builder.Property(n => n.ErrorMessage)
            .HasColumnName("error_message")
            .HasMaxLength(500);

        builder.Property(n => n.SentAt)
            .HasColumnName("sent_at");

        builder.Property(n => n.RetryCount)
            .HasColumnName("retry_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(n => n.ReferenceId)
            .HasColumnName("reference_id");

        builder.Property(n => n.ReferenceType)
            .HasColumnName("reference_type")
            .HasMaxLength(50);

        builder.Property(n => n.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(n => n.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasIndex(n => n.UserId).HasDatabaseName("ix_notifications_user_id");
        builder.HasIndex(n => n.Status).HasDatabaseName("ix_notifications_status");
        builder.HasIndex(n => n.Category).HasDatabaseName("ix_notifications_category");
        builder.HasIndex(n => n.CreatedAt).HasDatabaseName("ix_notifications_created_at");
        builder.HasIndex(n => new { n.UserId, n.Status }).HasDatabaseName("ix_notifications_user_status");
    }
}
