namespace FinTech.Modules.Ledger.Application.Services;

using FinTech.Infrastructure.Caching;
using FinTech.Infrastructure.Messaging;
using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Domain.Entities;
using FinTech.SharedKernel.Contracts;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using FinTech.SharedKernel.ValueObjects;
using Microsoft.Extensions.Logging;

public class LedgerService : ILedgerService
{
    private readonly ILedgerRepository _repository;
    private readonly ICacheService _cache;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<LedgerService> _logger;

    public LedgerService(
        ILedgerRepository repository,
        ICacheService cache,
        IEventPublisher eventPublisher,
        ILogger<LedgerService> logger)
    {
        _repository = repository;
        _cache = cache;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<Result<Money>> GetBalanceAsync(WalletId walletId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.Wallet.Balance(walletId.Value);

var cached = await _cache.GetAsync<CachedBalance>(cacheKey, ct);
        if (cached != null)
        {
            _logger.LogDebug("Cache hit for balance of wallet {WalletId}", walletId);
            var cachedMoney = Money.Create(cached.Amount, cached.Currency);
            if (cachedMoney.IsSuccess)
                return cachedMoney;
        }

_logger.LogDebug("Cache miss for balance of wallet {WalletId}, querying database", walletId);

        var balance = await _repository.GetBalanceAsync(walletId, ct);
        var currency = await _repository.GetWalletCurrencyAsync(walletId, ct);

var currencyCode = currency ?? "USD";

        var moneyResult = Money.Create(balance, currencyCode);
        if (moneyResult.IsFailure)
            return Result<Money>.Failure(moneyResult.Error);

await _cache.SetAsync(
            cacheKey,
            new CachedBalance(balance, currencyCode),
            CacheKeys.Ttl.Balance,
            ct);

        return moneyResult;
    }

private record CachedBalance(decimal Amount, string Currency);

    public async Task<Result<bool>> HasSufficientBalanceAsync(
        WalletId walletId,
        Money amount,
        CancellationToken ct = default)
    {
        var balanceResult = await GetBalanceAsync(walletId, ct);

        if (balanceResult.IsFailure)
            return Result<bool>.Failure(balanceResult.Error);

        var balance = balanceResult.Value!;

if (balance.Currency.Code != amount.Currency.Code)
            return Result<bool>.Failure(Error.CurrencyMismatch());

var hasSufficient = balance.Amount >= amount.Amount;

        return Result<bool>.Success(hasSufficient);
    }

    public async Task<Result<LedgerEntryId>> AppendCreditAsync(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description,
        CancellationToken ct = default)
    {
        var entryResult = LedgerEntry.CreateCredit(walletId, amount, referenceId, description);

        if (entryResult.IsFailure)
            return Result<LedgerEntryId>.Failure(entryResult.Error);

        var entry = entryResult.Value!;

        await _repository.AddAsync(entry, ct);
        await _repository.SaveChangesAsync(ct);

await InvalidateBalanceCacheAsync(walletId, referenceId, ct);

        return Result<LedgerEntryId>.Success(entry.Id);
    }

    public async Task<Result<LedgerEntryId>> AppendDebitAsync(
        WalletId walletId,
        Money amount,
        TransactionId referenceId,
        string? description,
        CancellationToken ct = default)
    {

        var hasSufficientResult = await HasSufficientBalanceAsync(walletId, amount, ct);

        if (hasSufficientResult.IsFailure)
            return Result<LedgerEntryId>.Failure(hasSufficientResult.Error);

        if (!hasSufficientResult.Value)
            return Result<LedgerEntryId>.Failure(Error.InsufficientBalance());

        var entryResult = LedgerEntry.CreateDebit(walletId, amount, referenceId, description);

        if (entryResult.IsFailure)
            return Result<LedgerEntryId>.Failure(entryResult.Error);

        var entry = entryResult.Value!;

        await _repository.AddAsync(entry, ct);
        await _repository.SaveChangesAsync(ct);

await InvalidateBalanceCacheAsync(walletId, referenceId, ct);

        return Result<LedgerEntryId>.Success(entry.Id);
    }

private async Task InvalidateBalanceCacheAsync(
        WalletId walletId,
        TransactionId transactionId,
        CancellationToken ct)
    {
        var cacheKey = CacheKeys.Wallet.Balance(walletId.Value);
        await _cache.RemoveAsync(cacheKey, ct);

        _logger.LogDebug("Invalidated balance cache for wallet {WalletId}", walletId);

try
        {
            await _eventPublisher.PublishAsync(
                new BalanceChangedIntegrationEvent
                {
                    WalletId = walletId.Value,
                    TransactionId = transactionId.Value
                },
                ct);
        }
        catch (Exception ex)
        {

            _logger.LogWarning(ex, "Failed to publish BalanceChangedIntegrationEvent for wallet {WalletId}", walletId);
        }
    }
}