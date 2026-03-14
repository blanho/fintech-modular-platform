using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;

namespace FinTech.BuildingBlocks.Application.Contracts;

public interface IIdentityService
{
    Task<Result<UserInfo>> GetUserInfoAsync(UserId userId, CancellationToken ct = default);

    Task<Result<bool>> ValidateUserExistsAsync(UserId userId, CancellationToken ct = default);
}

public record UserInfo(
    UserId Id,
    string Email,
    string? FirstName,
    string? LastName);