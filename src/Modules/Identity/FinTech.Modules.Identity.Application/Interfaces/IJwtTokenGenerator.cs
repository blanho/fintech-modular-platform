using FinTech.Modules.Identity.Domain.Entities;

namespace FinTech.Modules.Identity.Application.Interfaces;

public interface IJwtTokenGenerator
{
    TimeSpan RefreshTokenValidity { get; }

    string GenerateAccessToken(User user);

    Task<string> GenerateAccessTokenAsync(User user, CancellationToken ct = default);

    string GenerateRefreshToken();
}