namespace FinTech.Api.Middleware;

public class IdempotencyMiddleware
{
    private const string IdempotencyKeyHeader = "Idempotency-Key";
    private readonly ILogger<IdempotencyMiddleware> _logger;
    private readonly RequestDelegate _next;

    public IdempotencyMiddleware(RequestDelegate next, ILogger<IdempotencyMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (IsMutationMethod(context.Request.Method))
        {
            var idempotencyKey = GetOrCreateIdempotencyKey(context);
            context.Items["IdempotencyKey"] = idempotencyKey;

            _logger.LogDebug(
                "Request {Method} {Path} with IdempotencyKey: {IdempotencyKey}",
                context.Request.Method,
                context.Request.Path,
                idempotencyKey);
        }

        await _next(context);
    }

    private static bool IsMutationMethod(string method)
    {
        return method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
               method.Equals("PUT", StringComparison.OrdinalIgnoreCase) ||
               method.Equals("PATCH", StringComparison.OrdinalIgnoreCase) ||
               method.Equals("DELETE", StringComparison.OrdinalIgnoreCase);
    }

    private static string GetOrCreateIdempotencyKey(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(IdempotencyKeyHeader, out var key))
        {
            var keyValue = key.ToString();
            if (!string.IsNullOrWhiteSpace(keyValue)) return keyValue;
        }

        return $"auto_{Guid.NewGuid():N}";
    }
}