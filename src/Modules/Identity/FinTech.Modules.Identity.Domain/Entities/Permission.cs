namespace FinTech.Modules.Identity.Domain.Entities;

public sealed class Permission
{
    private Permission() { }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public Guid RoleId { get; private set; }

    public static Permission Create(string name, Guid roleId)
    {
        return new Permission
        {
            Id = Guid.NewGuid(),
            Name = name,
            RoleId = roleId
        };
    }
}
