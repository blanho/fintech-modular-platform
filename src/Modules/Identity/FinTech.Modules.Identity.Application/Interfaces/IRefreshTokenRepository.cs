namespace FinTech.Modules.Identity.Application.Interfaces;

using FinTech.Modules.Identity.Domain.Entities;
using FinTech.BuildingBlocks.Domain.Primitives;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
    Task<IEnumerable<RefreshToken>> GetActiveTokensByUserAsync(UserId userId, CancellationToken ct = default);
    Task AddAsync(RefreshToken token, CancellationToken ct = default);
    void Update(RefreshToken token);
    Task RevokeAllUserTokensAsync(UserId userId, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}