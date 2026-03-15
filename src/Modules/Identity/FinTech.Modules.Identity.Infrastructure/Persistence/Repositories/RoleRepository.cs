using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using FinTech.Modules.Identity.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Identity.Infrastructure.Persistence.Repositories;

public sealed class RoleRepository : IRoleRepository
{
    private readonly IdentityDbContext _context;

    public RoleRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<Role?> GetByTypeAsync(RoleType type, CancellationToken ct = default)
    {
        return await _context.Roles
            .Include(r => r.Permissions)
            .FirstOrDefaultAsync(r => r.Type == type, ct);
    }

    public async Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Roles
            .Include(r => r.Permissions)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task AddAsync(Role role, CancellationToken ct = default)
    {
        await _context.Roles.AddAsync(role, ct);
    }

    public async Task<IReadOnlyList<UserRole>> GetUserRolesAsync(UserId userId, CancellationToken ct = default)
    {
        return await _context.UserRoles
            .Include(ur => ur.Role)
            .ThenInclude(r => r.Permissions)
            .Where(ur => ur.UserId == userId)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<string>> GetUserPermissionsAsync(UserId userId, CancellationToken ct = default)
    {
        return await _context.UserRoles
            .Include(ur => ur.Role)
            .ThenInclude(r => r.Permissions)
            .Where(ur => ur.UserId == userId)
            .SelectMany(ur => ur.Role.Permissions)
            .Select(p => p.Name)
            .Distinct()
            .ToListAsync(ct);
    }

    public async Task AddUserRoleAsync(UserRole userRole, CancellationToken ct = default)
    {
        await _context.UserRoles.AddAsync(userRole, ct);
    }

    public async Task RemoveUserRoleAsync(UserId userId, Guid roleId, CancellationToken ct = default)
    {
        var userRole = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId, ct);

        if (userRole is not null)
            _context.UserRoles.Remove(userRole);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }

    public async Task SeedRolesAsync(CancellationToken ct = default)
    {
        foreach (var roleType in Enum.GetValues<RoleType>())
        {
            var existing = await _context.Roles.AnyAsync(r => r.Type == roleType, ct);
            if (existing)
                continue;

            var result = Role.Create(roleType, $"System {roleType} role");
            if (result.IsSuccess)
                await _context.Roles.AddAsync(result.Value!, ct);
        }

        await _context.SaveChangesAsync(ct);
    }
}
