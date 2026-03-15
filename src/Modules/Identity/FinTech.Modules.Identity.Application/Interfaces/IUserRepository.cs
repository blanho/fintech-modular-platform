using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Identity.Domain.Entities;

namespace FinTech.Modules.Identity.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(UserId userId, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    void Update(User user);
    Task<bool> ExistsAsync(UserId userId, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
