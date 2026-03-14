namespace FinTech.Modules.Identity.Infrastructure.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;
    private readonly TimeSpan _refreshTokenValidity;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
        _refreshTokenValidity = TimeSpan.FromDays(
            configuration.GetValue<int>("Jwt:RefreshTokenExpirationDays", 7));
    }

    public TimeSpan RefreshTokenValidity => _refreshTokenValidity;

    public string GenerateAccessToken(User user)
    {
        var secret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT secret is not configured");
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer is not configured");
        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience is not configured");
        var expirationMinutes = _configuration.GetValue<int>("Jwt:ExpirationMinutes", 60);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.Value.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email.Value),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.Value.ToString()),
            new Claim(ClaimTypes.Email, user.Email.Value),
        }.Concat(GetOptionalClaims(user)).ToArray();

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private static IEnumerable<Claim> GetOptionalClaims(User user)
    {
        var claims = new List<Claim>();

        if (!string.IsNullOrEmpty(user.FirstName))
            claims.Add(new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName));

        if (!string.IsNullOrEmpty(user.LastName))
            claims.Add(new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName));

        return claims;
    }
}