namespace FinTech.Modules.Identity.Infrastructure.Persistence.Configurations;

using FinTech.Modules.Identity.Domain.Entities;
using FinTech.Modules.Identity.Domain.ValueObjects;
using FinTech.BuildingBlocks.Domain.Primitives;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnName("id")
            .HasConversion(
                id => id.Value,
                value => new UserId(value));

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired()
            .HasConversion(
                email => email.Value,
                value => Email.Create(value).Value!);

        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(512)
            .IsRequired()
            .HasConversion(
                hash => hash.Value,
                value => PasswordHash.Create(value));

        builder.Property(u => u.Status)
            .HasColumnName("status")
            .IsRequired();

        builder.Property(u => u.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100);

        builder.Property(u => u.LastLoginAt)
            .HasColumnName("last_login_at");

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at");

builder.Ignore(u => u.DomainEvents);
    }
}