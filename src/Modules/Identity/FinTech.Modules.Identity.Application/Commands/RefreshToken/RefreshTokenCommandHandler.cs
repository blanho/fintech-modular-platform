using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Identity.Application.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<RefreshTokenResponse>>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<Result<RefreshTokenResponse>> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        var existingToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);
        if (existingToken == null)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("Invalid refresh token"));

        if (existingToken.IsRevoked)
        {
            _logger.LogWarning(
                "Refresh token reuse detected for user {UserId}. Revoking all tokens (potential theft)",
                existingToken.UserId);

            await _refreshTokenRepository.RevokeAllUserTokensAsync(existingToken.UserId, cancellationToken);
            await _refreshTokenRepository.SaveChangesAsync(cancellationToken);

            return Result<RefreshTokenResponse>.Failure(
                Error.Unauthorized("Token reuse detected. All sessions have been revoked for security"));
        }

        if (!existingToken.IsActive)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("Refresh token is expired"));

        var user = await _userRepository.GetByIdAsync(existingToken.UserId, cancellationToken);
        if (user == null || !user.IsActive)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("User not found or inactive"));

        var newAccessToken = await _jwtTokenGenerator.GenerateAccessTokenAsync(user, cancellationToken);
        var newRefreshTokenValue = _jwtTokenGenerator.GenerateRefreshToken();

        var newRefreshToken = Domain.Entities.RefreshToken.Create(
            user.Id,
            newRefreshTokenValue,
            _jwtTokenGenerator.RefreshTokenValidity);

        existingToken.Revoke(newRefreshTokenValue);
        _refreshTokenRepository.Update(existingToken);
        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);
        await _refreshTokenRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Refresh token rotated for user {UserId}", user.Id);

        return Result<RefreshTokenResponse>.Success(new RefreshTokenResponse(
            newAccessToken,
            newRefreshTokenValue,
            (int)TimeSpan.FromHours(1).TotalSeconds,
            "Bearer"
        ));
    }
}