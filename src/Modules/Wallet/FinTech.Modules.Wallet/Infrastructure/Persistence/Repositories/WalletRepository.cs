namespace FinTech.Modules.Wallet.Infrastructure.Persistence.Repositories;

using FinTech.SharedKernel.Primitives;
using FinTech.Modules.Wallet.Application.Interfaces;
using FinTech.Modules.Wallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _context;

    public WalletRepository(WalletDbContext context)
    {
        _context = context;
    }

    public async Task<Wallet?> GetByIdAsync(WalletId walletId, CancellationToken ct = default)
    {
        return await _context.Wallets
            .FirstOrDefaultAsync(w => w.Id == walletId, ct);
    }

    public async Task<IReadOnlyList<Wallet>> GetByUserIdAsync(UserId userId, CancellationToken ct = default)
    {
        return await _context.Wallets
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<(IReadOnlyList<Wallet> Items, int TotalCount)> GetByUserIdAsync(
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

    public async Task AddAsync(Wallet wallet, CancellationToken ct = default)
    {
        await _context.Wallets.AddAsync(wallet, ct);
    }

    public void Update(Wallet wallet)
    {
        _context.Wallets.Update(wallet);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}