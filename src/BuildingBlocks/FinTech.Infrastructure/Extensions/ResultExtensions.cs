namespace FinTech.Infrastructure.Extensions;

using FinTech.SharedKernel.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

public static class ResultExtensions
{

public static IActionResult ToActionResult(this Result result)
    {
        if (result.IsSuccess)
            return new OkResult();

        return ToErrorResult(result.Error);
    }

public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
        {
            return new OkObjectResult(new
            {
                success = true,
                data = result.Value
            });
        }

        return ToErrorResult(result.Error);
    }

public static IActionResult ToCreatedResult<T>(this Result<T> result, string? location = null)
    {
        if (result.IsSuccess)
        {
            var response = new
            {
                success = true,
                data = result.Value
            };

            if (!string.IsNullOrEmpty(location))
                return new CreatedResult(location, response);

            return new ObjectResult(response) { StatusCode = StatusCodes.Status201Created };
        }

        return ToErrorResult(result.Error);
    }

    private static IActionResult ToErrorResult(Error error)
    {
        var statusCode = error.Code switch
        {
            "VALIDATION_ERROR" => StatusCodes.Status400BadRequest,
            "INVALID_CREDENTIALS" => StatusCodes.Status401Unauthorized,
            "UNAUTHORIZED" => StatusCodes.Status401Unauthorized,
            "FORBIDDEN" => StatusCodes.Status403Forbidden,
            "NOT_FOUND" => StatusCodes.Status404NotFound,
            "CONFLICT" => StatusCodes.Status409Conflict,
            "INSUFFICIENT_BALANCE" => StatusCodes.Status422UnprocessableEntity,
            "WALLET_FROZEN" => StatusCodes.Status422UnprocessableEntity,
            "WALLET_CLOSED" => StatusCodes.Status422UnprocessableEntity,
            "DUPLICATE_TRANSACTION" => StatusCodes.Status422UnprocessableEntity,
            "CURRENCY_MISMATCH" => StatusCodes.Status422UnprocessableEntity,
            "SAME_WALLET_TRANSFER" => StatusCodes.Status422UnprocessableEntity,
            _ => StatusCodes.Status500InternalServerError
        };

        return new ObjectResult(new
        {
            success = false,
            error = new
            {
                code = error.Code,
                message = error.Message
            }
        })
        {
            StatusCode = statusCode
        };
    }
}