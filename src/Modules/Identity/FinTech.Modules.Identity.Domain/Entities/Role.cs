using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Identity.Domain.Enums;

namespace FinTech.Modules.Identity.Domain.Entities;

public sealed class Role : Entity<Guid>
{
    private readonly List<Permission> _permissions = new();

    private Role() { }

    public string Name { get; private set; } = string.Empty;
    public RoleType Type { get; private set; }
    public string? Description { get; private set; }
    public bool IsSystem { get; private set; }
    public IReadOnlyList<Permission> Permissions => _permissions.AsReadOnly();

    public static Result<Role> Create(RoleType type, string? description = null)
    {
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Name = type.ToString(),
            Type = type,
            Description = description,
            IsSystem = true
        };

        var defaultPermissions = Enums.Permissions.GetPermissionsForRole(type);
        foreach (var permissionName in defaultPermissions)
        {
            var permission = Permission.Create(permissionName, role.Id);
            role._permissions.Add(permission);
        }

        return Result<Role>.Success(role);
    }

    public Result AddPermission(string permissionName)
    {
        if (_permissions.Any(p => p.Name == permissionName))
            return Result.Failure(Error.Conflict($"Permission '{permissionName}' already exists"));

        _permissions.Add(Permission.Create(permissionName, Id));
        return Result.Success();
    }

    public Result RemovePermission(string permissionName)
    {
        var permission = _permissions.FirstOrDefault(p => p.Name == permissionName);
        if (permission is null)
            return Result.Failure(Error.NotFound("Permission"));

        _permissions.Remove(permission);
        return Result.Success();
    }

    public bool HasPermission(string permissionName)
    {
        return _permissions.Any(p => p.Name == permissionName);
    }
}
