using System.Net;
using System.Text.Json;
using FinTech.BuildingBlocks.Domain;
using FluentValidation;

namespace FinTech.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var correlationId = context.Items["CorrelationId"]?.ToString() ?? Guid.NewGuid().ToString();

        var (statusCode, errorResponse) = exception switch
        {
            ValidationException validationEx => HandleValidationException(validationEx, correlationId),
            DomainException domainEx => HandleDomainException(domainEx, correlationId),
            UnauthorizedAccessException => HandleUnauthorizedException(correlationId),
            KeyNotFoundException => HandleNotFoundException(correlationId),
            _ => HandleUnknownException(exception, correlationId)
        };

        if (statusCode == (int)HttpStatusCode.InternalServerError)
            _logger.LogError(
                exception,
                "[{CorrelationId}] Unhandled exception occurred: {Message}",
                correlationId,
                exception.Message);
        else
            _logger.LogWarning(
                "[{CorrelationId}] Handled exception: {ExceptionType} - {Message}",
                correlationId,
                exception.GetType().Name,
                exception.Message);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse, options));
    }

    private static (int StatusCode, object Response) HandleValidationException(
        ValidationException exception,
        string correlationId)
    {
        var details = exception.Errors
            .Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
            .ToList();

        return ((int)HttpStatusCode.BadRequest, new
        {
            success = false,
            error = new
            {
                code = "VALIDATION_ERROR",
                message = "One or more validation errors occurred",
                details
            },
            meta = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = correlationId
            }
        });
    }

    private static (int StatusCode, object Response) HandleDomainException(
        DomainException exception,
        string correlationId)
    {
        var statusCode = exception.Code switch
        {
            "NOT_FOUND" => (int)HttpStatusCode.NotFound,
            "CONFLICT" => (int)HttpStatusCode.Conflict,
            "UNAUTHORIZED" => (int)HttpStatusCode.Unauthorized,
            "FORBIDDEN" => (int)HttpStatusCode.Forbidden,
            "INSUFFICIENT_BALANCE" or "WALLET_FROZEN" or "WALLET_CLOSED" or "DUPLICATE_TRANSACTION"
                => (int)HttpStatusCode.UnprocessableEntity,
            _ => (int)HttpStatusCode.BadRequest
        };

        return (statusCode, new
        {
            success = false,
            error = new
            {
                code = exception.Code,
                message = exception.Message
            },
            meta = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = correlationId
            }
        });
    }

    private static (int StatusCode, object Response) HandleUnauthorizedException(string correlationId)
    {
        return ((int)HttpStatusCode.Unauthorized, new
        {
            success = false,
            error = new
            {
                code = "UNAUTHORIZED",
                message = "Authentication required"
            },
            meta = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = correlationId
            }
        });
    }

    private static (int StatusCode, object Response) HandleNotFoundException(string correlationId)
    {
        return ((int)HttpStatusCode.NotFound, new
        {
            success = false,
            error = new
            {
                code = "NOT_FOUND",
                message = "The requested resource was not found"
            },
            meta = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = correlationId
            }
        });
    }

    private static (int StatusCode, object Response) HandleUnknownException(
        Exception exception,
        string correlationId)
    {
        return ((int)HttpStatusCode.InternalServerError, new
        {
            success = false,
            error = new
            {
                code = "INTERNAL_ERROR",
                message = "An unexpected error occurred"
            },
            meta = new
            {
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = correlationId
            }
        });
    }
}