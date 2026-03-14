namespace FinTech.SharedKernel.Contracts;

using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;

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