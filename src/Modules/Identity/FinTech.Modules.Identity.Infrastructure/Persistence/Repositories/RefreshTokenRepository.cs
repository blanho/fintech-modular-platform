namespace FinTech.Modules.Identity.Infrastructure.Persistence.Repositories;

using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using FinTech.BuildingBlocks.Domain.Primitives;
using Microsoft.EntityFrameworkCore;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly IdentityDbContext _context;

    public RefreshTokenRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == token, ct);
    }

    public async Task<IEnumerable<RefreshToken>> GetActiveTokensByUserAsync(UserId userId, CancellationToken ct = default)
    {
        return await _context.RefreshTokens
            .Where(t => t.UserId == userId && t.IsActive)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(RefreshToken token, CancellationToken ct = default)
    {
        await _context.RefreshTokens.AddAsync(token, ct);
    }

    public void Update(RefreshToken token)
    {
        _context.RefreshTokens.Update(token);
    }

    public async Task RevokeAllUserTokensAsync(UserId userId, CancellationToken ct = default)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow)
            .ToListAsync(ct);

        foreach (var token in activeTokens)
        {
            token.Revoke();
        }
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}