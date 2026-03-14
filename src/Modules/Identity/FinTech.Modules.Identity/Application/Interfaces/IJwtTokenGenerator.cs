namespace FinTech.Modules.Identity.Application.Interfaces;

using FinTech.Modules.Identity.Domain.Entities;

public interface IJwtTokenGenerator
{

string GenerateAccessToken(User user);

string GenerateRefreshToken();

TimeSpan RefreshTokenValidity { get; }
}