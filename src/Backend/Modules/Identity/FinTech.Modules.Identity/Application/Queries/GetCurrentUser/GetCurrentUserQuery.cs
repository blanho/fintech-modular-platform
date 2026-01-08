namespace FinTech.Modules.Identity.Application.Queries.GetCurrentUser;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
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