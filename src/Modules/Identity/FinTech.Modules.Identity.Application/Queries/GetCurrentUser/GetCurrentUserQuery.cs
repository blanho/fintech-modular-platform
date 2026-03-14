namespace FinTech.Modules.Identity.Application.Queries.GetCurrentUser;

using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

public sealed record GetCurrentUserQuery(
    UserId UserId
) : IRequest<Result<CurrentUserResponse>>;

public sealed record CurrentUserResponse(
    Guid UserId,
    string Email,
    string? FirstName,
    string? LastName,
    string Status,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);