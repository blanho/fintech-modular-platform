using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Identity.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinTech.Modules.Identity.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id");

        builder.Property(t => t.UserId)
            .HasColumnName("user_id")
            .IsRequired()
            .HasConversion(
                id => id.Value,
                value => new UserId(value));

        builder.HasIndex(t => t.UserId);

        builder.Property(t => t.Token)
            .HasColumnName("token")
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(t => t.Token).IsUnique();

        builder.Property(t => t.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(t => t.RevokedAt)
            .HasColumnName("revoked_at");

        builder.Property(t => t.ReplacedByToken)
            .HasColumnName("replaced_by_token")
            .HasMaxLength(256);
    }
}