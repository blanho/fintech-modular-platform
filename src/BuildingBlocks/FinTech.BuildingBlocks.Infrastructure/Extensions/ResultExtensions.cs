using FinTech.BuildingBlocks.Domain.Results;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.BuildingBlocks.Infrastructure.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToActionResult(this Result result)
    {
        if (result.IsSuccess)
            return new OkResult();

        return MapError(result.Error);
    }

    public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Value);

        return MapError(result.Error);
    }

    public static IActionResult ToCreatedResult<T>(this Result<T> result, string? location = null)
    {
        if (result.IsSuccess)
            return new CreatedResult(location, result.Value);

        return MapError(result.Error);
    }

    private static IActionResult MapError(Error error)
    {
        return error.Code switch
        {
            "VALIDATION_ERROR" => new BadRequestObjectResult(new { error.Code, error.Message }),
            "NOT_FOUND" => new NotFoundObjectResult(new { error.Code, error.Message }),
            "CONFLICT" or "DUPLICATE_TRANSACTION" => new ConflictObjectResult(new { error.Code, error.Message }),
            "UNAUTHORIZED" or "INVALID_CREDENTIALS" => new UnauthorizedObjectResult(new { error.Code, error.Message }),
            "FORBIDDEN" => new ObjectResult(new { error.Code, error.Message }) { StatusCode = 403 },
            "INSUFFICIENT_BALANCE" or "WALLET_FROZEN" or "WALLET_CLOSED" or "CURRENCY_MISMATCH"
                or "SAME_WALLET_TRANSFER"
                => new UnprocessableEntityObjectResult(new { error.Code, error.Message }),
            _ => new ObjectResult(new { error.Code, error.Message }) { StatusCode = 500 }
        };
    }
}