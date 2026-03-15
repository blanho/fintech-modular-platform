using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.BuildingBlocks.EventBus;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.BuildingBlocks.Infrastructure.Caching;
using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Ledger.Application.Services;

public class LedgerService : ILedgerService
{
    private readonly ICacheService _cache;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<LedgerService> _logger;
    private readonly ILedgerRepository _repository;

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
            var newBalanceResult = await GetBalanceAsync(walletId, ct);
            var newBalance = newBalanceResult.IsSuccess ? newBalanceResult.Value!.Amount : 0m;
            var currency = newBalanceResult.IsSuccess ? newBalanceResult.Value!.Currency.Code : "USD";

            await _eventPublisher.PublishAsync(
                new BalanceChangedIntegrationEvent(
                    walletId.Value,
                    0m,
                    newBalance,
                    0m,
                    "LedgerEntry",
                    currency),
                ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish BalanceChangedIntegrationEvent for wallet {WalletId}", walletId);
        }
    }

    private record CachedBalance(decimal Amount, string Currency);
}
