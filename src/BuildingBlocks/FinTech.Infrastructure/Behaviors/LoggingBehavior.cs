namespace FinTech.Infrastructure.Behaviors;

using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid().ToString("N")[..8];

        _logger.LogInformation(
            "[{RequestId}] Handling {RequestName}",
            requestId, requestName);

        var stopwatch = Stopwatch.StartNew();

        try
        {
            var response = await next();

            stopwatch.Stop();

            _logger.LogInformation(
                "[{RequestId}] Handled {RequestName} in {ElapsedMilliseconds}ms",
                requestId, requestName, stopwatch.ElapsedMilliseconds);

if (stopwatch.ElapsedMilliseconds > 500)
            {
                _logger.LogWarning(
                    "[{RequestId}] Long running request: {RequestName} took {ElapsedMilliseconds}ms",
                    requestId, requestName, stopwatch.ElapsedMilliseconds);
            }

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(
                ex,
                "[{RequestId}] Error handling {RequestName} after {ElapsedMilliseconds}ms: {Message}",
                requestId, requestName, stopwatch.ElapsedMilliseconds, ex.Message);

            throw;
        }
    }
}