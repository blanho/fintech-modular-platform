using System.Collections.Concurrent;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Identity.Infrastructure.Middleware;

public sealed class AuthRateLimitingMiddleware
{
    private static readonly ConcurrentDictionary<string, RateLimitEntry> Clients = new();
    private static readonly string[] RateLimitedPaths = { "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh" };

    private readonly RequestDelegate _next;
    private readonly ILogger<AuthRateLimitingMiddleware> _logger;
    private readonly int _maxAttempts;
    private readonly TimeSpan _window;

    public AuthRateLimitingMiddleware(
        RequestDelegate next,
        ILogger<AuthRateLimitingMiddleware> logger,
        int maxAttempts = 10,
        TimeSpan? window = null)
    {
        _next = next;
        _logger = logger;
        _maxAttempts = maxAttempts;
        _window = window ?? TimeSpan.FromMinutes(1);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLowerInvariant() ?? string.Empty;

        if (!Array.Exists(RateLimitedPaths, p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase)))
        {
            await _next(context);
            return;
        }

        var clientKey = GetClientKey(context);
        var now = DateTime.UtcNow;

        var entry = Clients.AddOrUpdate(
            clientKey,
            _ => new RateLimitEntry(1, now),
            (_, existing) =>
            {
                if (now - existing.WindowStart > _window)
                    return new RateLimitEntry(1, now);

                return existing with { Count = existing.Count + 1 };
            });

        var remaining = Math.Max(0, _maxAttempts - entry.Count);
        var resetTime = entry.WindowStart.Add(_window);

        context.Response.Headers["X-RateLimit-Limit"] = _maxAttempts.ToString();
        context.Response.Headers["X-RateLimit-Remaining"] = remaining.ToString();
        context.Response.Headers["X-RateLimit-Reset"] = new DateTimeOffset(resetTime).ToUnixTimeSeconds().ToString();

        if (entry.Count > _maxAttempts)
        {
            _logger.LogWarning(
                "Rate limit exceeded for client {ClientKey} on {Path}. Attempts: {Count}",
                clientKey, path, entry.Count);

            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers["Retry-After"] = ((int)(resetTime - now).TotalSeconds).ToString();
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Too many requests",
                retryAfter = (int)(resetTime - now).TotalSeconds
            });
            return;
        }

        await _next(context);
    }

    private static string GetClientKey(HttpContext context)
    {
        var forwarded = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var ip = forwarded ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return $"auth_rate:{ip}";
    }

    private sealed record RateLimitEntry(int Count, DateTime WindowStart);
}
