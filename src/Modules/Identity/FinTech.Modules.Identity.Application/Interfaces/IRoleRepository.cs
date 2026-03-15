using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Identity.Domain.Entities;
using FinTech.Modules.Identity.Domain.Enums;

namespace FinTech.Modules.Identity.Application.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByTypeAsync(RoleType type, CancellationToken ct = default);
    Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Role role, CancellationToken ct = default);
    Task<IReadOnlyList<UserRole>> GetUserRolesAsync(UserId userId, CancellationToken ct = default);
    Task<IReadOnlyList<string>> GetUserPermissionsAsync(UserId userId, CancellationToken ct = default);
    Task AddUserRoleAsync(UserRole userRole, CancellationToken ct = default);
    Task RemoveUserRoleAsync(UserId userId, Guid roleId, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
    Task SeedRolesAsync(CancellationToken ct = default);
}
