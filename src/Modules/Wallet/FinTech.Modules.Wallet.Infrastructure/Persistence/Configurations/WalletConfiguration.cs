using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Wallet.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Wallet.Infrastructure.Persistence.Configurations;

public sealed class WalletConfiguration : IEntityTypeConfiguration<Domain.Entities.Wallet>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.Wallet> builder)
    {
        builder.ToTable("wallets");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new WalletId(value));

        builder.Property(w => w.UserId)
            .HasColumnName("user_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new UserId(value));

        builder.Property(w => w.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsRequired()
            .HasConversion(
                currency => currency.Code,
                code => Currency.FromCode(code).Value!);

        builder.Property(w => w.Status)
            .HasColumnName("status")
            .IsRequired()
            .HasConversion(
                status => (int)status,
                value => (WalletStatus)value);

        builder.Property(w => w.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(w => w.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(w => w.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasIndex(w => w.UserId)
            .HasDatabaseName("ix_wallets_user_id");

        builder.HasIndex(w => w.Currency)
            .HasDatabaseName("ix_wallets_currency");

        builder.HasIndex(w => w.Status)
            .HasDatabaseName("ix_wallets_status");

        builder.Ignore(w => w.DomainEvents);
    }
}