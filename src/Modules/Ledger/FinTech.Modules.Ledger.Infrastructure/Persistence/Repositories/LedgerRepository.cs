using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Modules.Ledger.Infrastructure.Persistence.Repositories;

public class LedgerRepository : ILedgerRepository
{
    private readonly LedgerDbContext _context;

    public LedgerRepository(LedgerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LedgerEntry>> GetByWalletIdAsync(
        WalletId walletId,
        CancellationToken ct = default)
    {
        return await _context.LedgerEntries
            .Where(e => e.WalletId == walletId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<(IEnumerable<LedgerEntry> Entries, int TotalCount)> GetByWalletIdAsync(
        WalletId walletId,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.LedgerEntries
            .Where(e => e.WalletId == walletId)
            .OrderByDescending(e => e.CreatedAt);

        var totalCount = await query.CountAsync(ct);

        var entries = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (entries, totalCount);
    }

    public async Task<IEnumerable<LedgerEntry>> GetByReferenceIdAsync(
        TransactionId referenceId,
        CancellationToken ct = default)
    {
        return await _context.LedgerEntries
            .Where(e => e.ReferenceId == referenceId)
            .OrderBy(e => e.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<decimal> GetBalanceAsync(WalletId walletId, CancellationToken ct = default)
    {
        return await _context.LedgerEntries
            .Where(e => e.WalletId == walletId)
            .SumAsync(e => e.Amount, ct);
    }

    public async Task<string?> GetWalletCurrencyAsync(WalletId walletId, CancellationToken ct = default)
    {
        return await _context.LedgerEntries
            .Where(e => e.WalletId == walletId)
            .Select(e => e.Currency)
            .FirstOrDefaultAsync(ct);
    }

    public async Task AddAsync(LedgerEntry entry, CancellationToken ct = default)
    {
        await _context.LedgerEntries.AddAsync(entry, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}