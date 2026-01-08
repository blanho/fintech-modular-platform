namespace FinTech.Modules.Transaction.Infrastructure.Persistence.Repositories;

using Microsoft.EntityFrameworkCore;
using FinTech.SharedKernel.Primitives;
using FinTech.Modules.Transaction.Application.Interfaces;
using FinTech.Modules.Transaction.Domain.Entities;
using FinTech.Modules.Transaction.Domain.Enums;

public class TransactionRepository : ITransactionRepository
{
    private readonly TransactionDbContext _context;

    public TransactionRepository(TransactionDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(TransactionId id, CancellationToken ct = default)
    {
        return await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<Transaction?> GetByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default)
    {
        return await _context.Transactions
            .FirstOrDefaultAsync(t => t.IdempotencyKey == idempotencyKey, ct);
    }

    public async Task<IReadOnlyList<Transaction>> GetByWalletIdAsync(
        WalletId walletId,
        int page = 1,
        int pageSize = 20,
        TransactionType? type = null,
        TransactionStatus? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildWalletQuery(walletId, type, status, fromDate, toDate);

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<int> GetCountByWalletIdAsync(
        WalletId walletId,
        TransactionType? type = null,
        TransactionStatus? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        CancellationToken ct = default)
    {
        var query = BuildWalletQuery(walletId, type, status, fromDate, toDate);
        return await query.CountAsync(ct);
    }

    private IQueryable<Transaction> BuildWalletQuery(
        WalletId walletId,
        TransactionType? type,
        TransactionStatus? status,
        DateTime? fromDate,
        DateTime? toDate)
    {
        var query = _context.Transactions
            .Where(t => t.SourceWalletId == walletId || t.TargetWalletId == walletId);

        if (type.HasValue)
            query = query.Where(t => t.Type == type.Value);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (fromDate.HasValue)
            query = query.Where(t => t.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(t => t.CreatedAt <= toDate.Value);

        return query;
    }

    public async Task AddAsync(Transaction transaction, CancellationToken ct = default)
    {
        await _context.Transactions.AddAsync(transaction, ct);
    }

    public void Update(Transaction transaction)
    {
        _context.Transactions.Update(transaction);
    }

    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}