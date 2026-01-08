namespace FinTech.Modules.Ledger.Infrastructure.Persistence.Configurations;

using FinTech.Modules.Ledger.Domain.Entities;
using FinTech.SharedKernel.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class LedgerEntryConfiguration : IEntityTypeConfiguration<LedgerEntry>
{
    public void Configure(EntityTypeBuilder<LedgerEntry> builder)
    {
        builder.ToTable("entries");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new LedgerEntryId(value));

        builder.Property(e => e.WalletId)
            .HasColumnName("wallet_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new WalletId(value));

        builder.HasIndex(e => e.WalletId);

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(18, 4)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsRequired();

        builder.Property(e => e.ReferenceId)
            .HasColumnName("reference_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new TransactionId(value));

        builder.HasIndex(e => e.ReferenceId);

        builder.Property(e => e.EntryType)
            .HasColumnName("entry_type")
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasIndex(e => e.CreatedAt);

builder.Ignore(e => e.DomainEvents);
    }
}