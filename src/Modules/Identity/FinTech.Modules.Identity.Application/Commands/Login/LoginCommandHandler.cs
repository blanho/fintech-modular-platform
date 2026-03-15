using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Identity.Application.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<LoginResponse>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null)
            return Result<LoginResponse>.Failure(Error.InvalidCredentials());

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash.Value))
            return Result<LoginResponse>.Failure(Error.InvalidCredentials());

        if (user.Status != UserStatus.Active)
            return Result<LoginResponse>.Failure(Error.Forbidden("User account is not active"));

        var accessToken = await _jwtTokenGenerator.GenerateAccessTokenAsync(user, cancellationToken);
        var refreshTokenValue = _jwtTokenGenerator.GenerateRefreshToken();

        var refreshToken = Domain.Entities.RefreshToken.Create(
            user.Id,
            refreshTokenValue,
            _jwtTokenGenerator.RefreshTokenValidity);

        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);

        user.RecordLogin();
        _userRepository.Update(user);

        await _refreshTokenRepository.SaveChangesAsync(cancellationToken);

        return Result<LoginResponse>.Success(new LoginResponse(
            accessToken,
            refreshTokenValue,
            (int)TimeSpan.FromHours(1).TotalSeconds,
            "Bearer",
            new UserDto(
                user.Id.Value,
                user.Email.Value,
                user.FirstName,
                user.LastName
            )
        ));
    }
}