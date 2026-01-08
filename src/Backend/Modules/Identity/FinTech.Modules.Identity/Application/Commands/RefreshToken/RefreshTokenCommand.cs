namespace FinTech.Modules.Identity.Application.Commands.RefreshToken;

using FinTech.SharedKernel.Results;
using MediatR;

public sealed record RefreshTokenCommand(
    string RefreshToken
) : IRequest<Result<RefreshTokenResponse>>;

public sealed record RefreshTokenResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    string TokenType
);