using FinTech.BuildingBlocks.Domain.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Transaction.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Domain.Entities.Transaction>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Transaction> builder)
    {
        builder.ToTable("transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new TransactionId(value));

        builder.Property(t => t.Type)
            .HasColumnName("type")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(t => t.Status)
            .HasColumnName("status")
            .HasConversion<int>()
            .IsRequired();

        builder.OwnsOne(t => t.Amount, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("amount")
                .HasPrecision(18, 4)
                .IsRequired();

            money.OwnsOne(m => m.Currency, currency =>
            {
                currency.Property(c => c.Code)
                    .HasColumnName("currency")
                    .HasMaxLength(3)
                    .IsFixedLength()
                    .IsRequired();
            });
        });

        builder.Property(t => t.SourceWalletId)
            .HasColumnName("source_wallet_id")
            .HasConversion(
                id => id.Value,
                value => new WalletId(value))
            .IsRequired();

        builder.Property(t => t.TargetWalletId)
            .HasColumnName("target_wallet_id")
            .HasConversion(
                id => id.HasValue ? id.Value.Value : (Guid?)null,
                value => value.HasValue ? new WalletId(value.Value) : null);

        builder.Property(t => t.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

        builder.Property(t => t.IdempotencyKey)
            .HasColumnName("idempotency_key")
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(t => t.IdempotencyKey)
            .IsUnique();

        builder.Property(t => t.FailureReason)
            .HasColumnName("failure_reason")
            .HasMaxLength(500);

        builder.Property(t => t.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(t => t.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(t => t.CompletedAt)
            .HasColumnName("completed_at");

        builder.HasIndex(t => t.SourceWalletId)
            .HasDatabaseName("ix_transactions_source_wallet_id");

        builder.HasIndex(t => t.TargetWalletId)
            .HasDatabaseName("ix_transactions_target_wallet_id")
            .HasFilter("target_wallet_id IS NOT NULL");

        builder.HasIndex(t => t.Status)
            .HasDatabaseName("ix_transactions_status");

        builder.HasIndex(t => t.CreatedAt)
            .HasDatabaseName("ix_transactions_created_at");

        builder.HasIndex(t => new { t.SourceWalletId, t.CreatedAt })
            .HasDatabaseName("ix_transactions_source_wallet_created");
    }
}