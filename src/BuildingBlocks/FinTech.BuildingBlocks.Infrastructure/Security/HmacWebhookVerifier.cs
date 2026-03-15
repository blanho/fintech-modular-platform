using System.Security.Cryptography;
using System.Text;
using FinTech.BuildingBlocks.Application.Contracts;

namespace FinTech.BuildingBlocks.Infrastructure.Security;

public sealed class HmacWebhookVerifier : IWebhookVerifier
{
    public bool Verify(string payload, string signature, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        var computedSignature = Convert.ToHexStringLower(computedHash);

        var cleanSignature = signature
            .Replace("sha256=", string.Empty, StringComparison.OrdinalIgnoreCase)
            .Trim();

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(computedSignature),
            Encoding.UTF8.GetBytes(cleanSignature.ToLowerInvariant()));
    }
}
