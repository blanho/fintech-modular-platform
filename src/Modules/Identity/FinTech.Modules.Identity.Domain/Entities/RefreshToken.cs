namespace FinTech.Modules.Identity.Domain.Entities;

using FinTech.BuildingBlocks.Domain.Primitives;

public sealed class RefreshToken
{
    public Guid Id { get; private set; }
    public UserId UserId { get; private set; }
    public string Token { get; private set; } = null!;
    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? ReplacedByToken { get; private set; }

    private RefreshToken() { }

public static RefreshToken Create(UserId userId, string token, TimeSpan validity)
    {
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.Add(validity),
            CreatedAt = DateTime.UtcNow
        };
    }

public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

public bool IsRevoked => RevokedAt != null;

public bool IsActive => !IsExpired && !IsRevoked;

public void Revoke(string? replacedByToken = null)
    {
        RevokedAt = DateTime.UtcNow;
        ReplacedByToken = replacedByToken;
    }
}