using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Identity.Domain.Enums;

namespace FinTech.Modules.Identity.Domain.Entities;

public sealed class UserRole
{
    private UserRole() { }

    public Guid Id { get; private set; }
    public UserId UserId { get; private set; }
    public Guid RoleId { get; private set; }
    public DateTime AssignedAt { get; private set; }
    public Guid? AssignedBy { get; private set; }

    public Role Role { get; private set; } = null!;

    public static UserRole Create(UserId userId, Guid roleId, Guid? assignedBy = null)
    {
        return new UserRole
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            RoleId = roleId,
            AssignedAt = DateTime.UtcNow,
            AssignedBy = assignedBy
        };
    }
}
