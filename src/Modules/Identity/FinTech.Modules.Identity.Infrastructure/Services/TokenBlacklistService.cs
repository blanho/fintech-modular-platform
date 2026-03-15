using FinTech.BuildingBlocks.Infrastructure.Caching;
using FinTech.Modules.Identity.Application.Interfaces;

namespace FinTech.Modules.Identity.Infrastructure.Services;

public sealed class TokenBlacklistService : ITokenBlacklistService
{
    private const string BlacklistPrefix = "token:blacklist:";
    private readonly ICacheService _cacheService;

    public TokenBlacklistService(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public async Task BlacklistTokenAsync(string jti, TimeSpan remainingLifetime, CancellationToken ct = default)
    {
        var key = $"{BlacklistPrefix}{jti}";
        await _cacheService.SetAsync(key, true, remainingLifetime, ct);
    }

    public async Task<bool> IsBlacklistedAsync(string jti, CancellationToken ct = default)
    {
        var key = $"{BlacklistPrefix}{jti}";
        var result = await _cacheService.GetAsync<bool?>(key, ct);
        return result == true;
    }
}
