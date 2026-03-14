using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Wallet.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Wallet.Infrastructure.Persistence.Repositories;

public sealed class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _context;

    public WalletRepository(WalletDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Entities.Wallet?> GetByIdAsync(WalletId walletId, CancellationToken ct = default)
    {
        return await _context.Wallets
            .FirstOrDefaultAsync(w => w.Id == walletId, ct);
    }

    public async Task<IReadOnlyList<Domain.Entities.Wallet>> GetByUserIdAsync(UserId userId,
        CancellationToken ct = default)
    {
        return await _context.Wallets
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<Domain.Entities.Wallet> Items, int TotalCount)> GetByUserIdAsync(
        UserId userId,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.Wallets
            .Where(w => w.UserId == userId);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<bool> ExistsAsync(WalletId walletId, CancellationToken ct = default)
    {
        return await _context.Wallets
            .AnyAsync(w => w.Id == walletId, ct);
    }

    public async Task AddAsync(Domain.Entities.Wallet wallet, CancellationToken ct = default)
    {
        await _context.Wallets.AddAsync(wallet, ct);
    }

    public void Update(Domain.Entities.Wallet wallet)
    {
        _context.Wallets.Update(wallet);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}