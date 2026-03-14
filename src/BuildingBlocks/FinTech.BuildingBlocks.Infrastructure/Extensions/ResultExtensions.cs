namespace FinTech.BuildingBlocks.Infrastructure.Extensions;

using FinTech.BuildingBlocks.Domain.Results;
using Microsoft.AspNetCore.Http;

public static class ResultExtensions
{
    public static IResult ToActionResult(this Result result)
    {
        if (result.IsSuccess)
            return Results.Ok();

        return MapError(result.Error);
    }

    public static IResult ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return Results.Ok(result.Value);

        return MapError(result.Error);
    }

    public static IResult ToCreatedResult<T>(this Result<T> result, string? location = null)
    {
        if (result.IsSuccess)
            return Results.Created(location, result.Value);

        return MapError(result.Error);
    }

    private static IResult MapError(Error error)
    {
        return error.Code switch
        {
            "VALIDATION_ERROR" => Results.BadRequest(new { error.Code, error.Message }),
            "NOT_FOUND" => Results.NotFound(new { error.Code, error.Message }),
            "CONFLICT" or "DUPLICATE_TRANSACTION" => Results.Conflict(new { error.Code, error.Message }),
            "UNAUTHORIZED" or "INVALID_CREDENTIALS" => Results.Unauthorized(),
            "FORBIDDEN" => Results.Forbid(),
            "INSUFFICIENT_BALANCE" or "WALLET_FROZEN" or "WALLET_CLOSED" or "CURRENCY_MISMATCH" or "SAME_WALLET_TRANSFER"
                => Results.UnprocessableEntity(new { error.Code, error.Message }),
            _ => Results.Problem(error.Message, statusCode: 500)
        };
    }
}
