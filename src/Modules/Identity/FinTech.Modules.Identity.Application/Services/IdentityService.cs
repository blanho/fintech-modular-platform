namespace FinTech.Modules.Identity.Application.Services;

using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;

public class IdentityService : IIdentityService
{
    private readonly IUserRepository _userRepository;

    public IdentityService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserInfo>> GetUserInfoAsync(UserId userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct);

        if (user == null)
            return Result<UserInfo>.Failure(Error.NotFound("User"));

        return Result<UserInfo>.Success(new UserInfo(
            user.Id,
            user.Email.Value,
            user.FirstName,
            user.LastName));
    }

    public async Task<Result<bool>> ValidateUserExistsAsync(UserId userId, CancellationToken ct = default)
    {
        var exists = await _userRepository.ExistsAsync(userId, ct);
        return Result<bool>.Success(exists);
    }
}