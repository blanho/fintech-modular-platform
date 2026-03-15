using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Identity.Application.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password
) : IRequest<Result<LoginResponse>>;

public sealed record LoginResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    string TokenType,
    UserDto User
);

public sealed record UserDto(
    Guid UserId,
    string Email,
    string? FirstName,
    string? LastName
);
