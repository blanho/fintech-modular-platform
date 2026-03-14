using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Identity.Application.Commands.RefreshToken;

public sealed record RefreshTokenCommand(
    string RefreshToken
) : IRequest<Result<RefreshTokenResponse>>;

public sealed record RefreshTokenResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    string TokenType
);