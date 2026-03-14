namespace FinTech.Infrastructure.Caching;

using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public RedisCacheService(IDistributedCache cache, ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default) where T : class
    {
        try
        {
            var data = await _cache.GetStringAsync(key, ct);
            if (string.IsNullOrEmpty(data))
                return null;

            return JsonSerializer.Deserialize<T>(data, JsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to get cached value for key {Key}", key);
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken ct = default) where T : class
    {
        try
        {
            var options = new DistributedCacheEntryOptions();
            if (expiration.HasValue)
            {
                options.AbsoluteExpirationRelativeToNow = expiration.Value;
            }
            else
            {

                options.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            }

            var data = JsonSerializer.Serialize(value, JsonOptions);
            await _cache.SetStringAsync(key, data, options, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to set cached value for key {Key}", key);
        }
    }

    public async Task RemoveAsync(string key, CancellationToken ct = default)
    {
        try
        {
            await _cache.RemoveAsync(key, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to remove cached value for key {Key}", key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefix, CancellationToken ct = default)
    {

_logger.LogDebug("RemoveByPrefixAsync called with prefix {Prefix} - not implemented for IDistributedCache", prefix);
        await Task.CompletedTask;
    }

    public async Task<T?> GetOrSetAsync<T>(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan? expiration = null,
        CancellationToken ct = default) where T : class
    {
        var cached = await GetAsync<T>(key, ct);
        if (cached != null)
            return cached;

        var value = await factory(ct);
        if (value != null)
        {
            await SetAsync(key, value, expiration, ct);
        }

        return value;
    }
}