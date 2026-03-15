using System.Diagnostics;
using FinTech.BuildingBlocks.Application.Abstractions;
using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Audit.Application.Behaviors;

public sealed class AuditBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IAuditService _auditService;
    private readonly IRequestContext _requestContext;
    private readonly ILogger<AuditBehavior<TRequest, TResponse>> _logger;

    public AuditBehavior(
        IAuditService auditService,
        IRequestContext requestContext,
        ILogger<AuditBehavior<TRequest, TResponse>> logger)
    {
        _auditService = auditService;
        _requestContext = requestContext;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        if (!IsAuditableRequest(requestName))
            return await next();

        var stopwatch = Stopwatch.StartNew();
        var isSuccess = true;
        string? errorMessage = null;

        try
        {
            var response = await next();
            stopwatch.Stop();

            if (response is Result result && result.IsFailure)
            {
                isSuccess = false;
                errorMessage = result.Error.Message;
            }

            await RecordAuditEntry(
                requestName,
                ExtractResourceId(request),
                isSuccess,
                errorMessage,
                stopwatch.ElapsedMilliseconds,
                cancellationToken);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            await RecordAuditEntry(
                requestName,
                ExtractResourceId(request),
                false,
                ex.Message,
                stopwatch.ElapsedMilliseconds,
                cancellationToken);

            throw;
        }
    }

    private async Task RecordAuditEntry(
        string action,
        string? resourceId,
        bool isSuccess,
        string? errorMessage,
        long durationMs,
        CancellationToken ct)
    {
        try
        {
            var entry = new AuditEntry(
                _requestContext.UserId,
                action,
                ExtractModuleName(),
                resourceId,
                isSuccess,
                errorMessage,
                durationMs,
                _requestContext.IpAddress,
                _requestContext.UserAgent,
                _requestContext.CorrelationId);

            await _auditService.RecordAsync(entry, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to record audit entry for {Action}", action);
        }
    }

    private static bool IsAuditableRequest(string requestName)
    {
        return requestName.EndsWith("Command", StringComparison.Ordinal);
    }

    private static string ExtractModuleName()
    {
        var ns = typeof(TRequest).Namespace ?? string.Empty;
        var parts = ns.Split('.');
        var modulesIndex = Array.IndexOf(parts, "Modules");

        return modulesIndex >= 0 && modulesIndex + 1 < parts.Length
            ? parts[modulesIndex + 1]
            : "Unknown";
    }

    private static string? ExtractResourceId(TRequest request)
    {
        var type = typeof(TRequest);

        foreach (var prop in type.GetProperties())
        {
            if (!prop.Name.EndsWith("Id", StringComparison.Ordinal))
                continue;

            if (prop.PropertyType == typeof(Guid))
            {
                var value = (Guid)(prop.GetValue(request) ?? Guid.Empty);
                return value != Guid.Empty ? value.ToString() : null;
            }

            if (prop.PropertyType == typeof(Guid?))
            {
                var value = (Guid?)prop.GetValue(request);
                return value?.ToString();
            }
        }

        return null;
    }
}
