namespace FinTech.Modules.Identity.Application.Commands.RefreshToken;

using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using MediatR;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<RefreshTokenResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<RefreshTokenResponse>> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {

        var existingToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);
        if (existingToken == null)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("Invalid refresh token"));

if (!existingToken.IsActive)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("Refresh token is expired or revoked"));

var user = await _userRepository.GetByIdAsync(existingToken.UserId, cancellationToken);
        if (user == null || !user.IsActive)
            return Result<RefreshTokenResponse>.Failure(Error.Unauthorized("User not found or inactive"));

var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var newRefreshTokenValue = _jwtTokenGenerator.GenerateRefreshToken();

var newRefreshToken = Domain.Entities.RefreshToken.Create(
            user.Id,
            newRefreshTokenValue,
            _jwtTokenGenerator.RefreshTokenValidity);

existingToken.Revoke(newRefreshTokenValue);
        _refreshTokenRepository.Update(existingToken);
        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);
        await _refreshTokenRepository.SaveChangesAsync(cancellationToken);

        return Result<RefreshTokenResponse>.Success(new RefreshTokenResponse(
            newAccessToken,
            newRefreshTokenValue,
            (int)TimeSpan.FromHours(1).TotalSeconds,
            "Bearer"
        ));
    }
}