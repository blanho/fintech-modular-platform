namespace FinTech.BuildingBlocks.Infrastructure.Caching;

using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

public sealed class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;

    public RedisCacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
    {
        var cached = await _cache.GetStringAsync(key, ct);
        return cached is null ? default : JsonSerializer.Deserialize<T>(cached);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken ct = default)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5)
        };

        var json = JsonSerializer.Serialize(value);
        await _cache.SetStringAsync(key, json, options, ct);
    }

    public async Task RemoveAsync(string key, CancellationToken ct = default)
    {
        await _cache.RemoveAsync(key, ct);
    }

    public Task RemoveByPrefixAsync(string prefixKey, CancellationToken ct = default)
    {
        return Task.CompletedTask;
    }
}
