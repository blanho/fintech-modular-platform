namespace FinTech.Modules.Notification.Infrastructure.Persistence.Configurations;

using FinTech.Modules.Notification.Domain.Entities;
using FinTech.Modules.Notification.Domain.Primitives;
using FinTech.SharedKernel.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class NotificationPreferenceConfiguration : IEntityTypeConfiguration<NotificationPreference>
{
    public void Configure(EntityTypeBuilder<NotificationPreference> builder)
    {
        builder.ToTable("preferences");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new NotificationPreferenceId(value));

        builder.Property(p => p.UserId)
            .HasColumnName("user_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new UserId(value));

        builder.Property(p => p.EmailEnabled)
            .HasColumnName("email_enabled")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.PushEnabled)
            .HasColumnName("push_enabled")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.SmsEnabled)
            .HasColumnName("sms_enabled")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(p => p.TransactionAlerts)
            .HasColumnName("transaction_alerts")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.SecurityAlerts)
            .HasColumnName("security_alerts")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.MarketingEnabled)
            .HasColumnName("marketing_enabled")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("updated_at");

builder.HasIndex(p => p.UserId)
            .IsUnique()
            .HasDatabaseName("ix_preferences_user_id");
    }
}