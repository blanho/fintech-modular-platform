using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Identity.Application.Commands.Logout;

public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
{
    private readonly ITokenBlacklistService _tokenBlacklist;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<LogoutCommandHandler> _logger;

    public LogoutCommandHandler(
        ITokenBlacklistService tokenBlacklist,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<LogoutCommandHandler> logger)
    {
        _tokenBlacklist = tokenBlacklist;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var tokenInfo = _jwtTokenGenerator.ExtractTokenInfo(request.AccessToken);

        if (tokenInfo is not null)
        {
            var remaining = tokenInfo.Value.ExpiresAt - DateTime.UtcNow;
            if (remaining > TimeSpan.Zero)
            {
                await _tokenBlacklist.BlacklistTokenAsync(tokenInfo.Value.Jti, remaining, cancellationToken);
                _logger.LogInformation("Blacklisted access token {Jti}", tokenInfo.Value.Jti);
            }
        }

        if (!string.IsNullOrEmpty(request.RefreshToken))
        {
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(
                request.RefreshToken, cancellationToken);

            if (refreshToken is { IsActive: true })
            {
                refreshToken.Revoke();
                _refreshTokenRepository.Update(refreshToken);
                await _refreshTokenRepository.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Revoked refresh token for logout");
            }
        }

        return Result.Success();
    }
}
