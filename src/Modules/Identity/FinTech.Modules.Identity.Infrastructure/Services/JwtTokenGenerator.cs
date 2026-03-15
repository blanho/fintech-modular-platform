using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FinTech.Modules.Identity.Infrastructure.Services;

public sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;
    private readonly IRoleRepository _roleRepository;

    public JwtTokenGenerator(IConfiguration configuration, IRoleRepository roleRepository)
    {
        _configuration = configuration;
        _roleRepository = roleRepository;
        RefreshTokenValidity = TimeSpan.FromDays(
            configuration.GetValue("Jwt:RefreshTokenExpirationDays", 7));
    }

    public TimeSpan RefreshTokenValidity { get; }

    public string GenerateAccessToken(User user)
    {
        return GenerateAccessTokenAsync(user).GetAwaiter().GetResult();
    }

    public async Task<string> GenerateAccessTokenAsync(User user, CancellationToken ct = default)
    {
        var secret = _configuration["Jwt:Secret"]
                     ?? throw new InvalidOperationException("JWT secret is not configured");
        var issuer = _configuration["Jwt:Issuer"]
                     ?? throw new InvalidOperationException("JWT issuer is not configured");
        var audience = _configuration["Jwt:Audience"]
                       ?? throw new InvalidOperationException("JWT audience is not configured");
        var expirationMinutes = _configuration.GetValue("Jwt:ExpirationMinutes", 60);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.Value.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email.Value),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.Value.ToString()),
            new(ClaimTypes.Email, user.Email.Value)
        };

        claims.AddRange(GetOptionalClaims(user));

        var permissions = await _roleRepository.GetUserPermissionsAsync(user.Id, ct);
        var userRoles = await _roleRepository.GetUserRolesAsync(user.Id, ct);

        foreach (var userRole in userRoles)
            claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));

        foreach (var permission in permissions)
            claims.Add(new Claim("permission", permission));

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
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

    public TokenInfo? ExtractTokenInfo(string accessToken)
    {
        var handler = new JwtSecurityTokenHandler();
        if (!handler.CanReadToken(accessToken))
            return null;

        var jwt = handler.ReadJwtToken(accessToken);
        var jti = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

        if (string.IsNullOrEmpty(jti))
            return null;

        return new TokenInfo(jti, jwt.ValidTo);
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