using FinTech.BuildingBlocks.Domain;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Wallet.Domain.Enums;
using FinTech.Modules.Wallet.Domain.Events;

namespace FinTech.Modules.Wallet.Domain.Entities;

public sealed class Wallet : AggregateRoot<WalletId>
{
    private Wallet()
    {
    }

    public UserId UserId { get; private set; }

    public Currency Currency { get; private set; } = null!;

    public WalletStatus Status { get; private set; }

    public string Name { get; private set; } = null!;

    public static Result<Wallet> Create(
        UserId userId,
        Currency currency,
        string? name = null)
    {
        if (userId.IsEmpty)
            return Result<Wallet>.Failure(Error.Validation("User ID is required"));

        var walletName = string.IsNullOrWhiteSpace(name)
            ? $"{currency.Code} Wallet"
            : name.Trim();

        if (walletName.Length > 100)
            return Result<Wallet>.Failure(Error.Validation("Wallet name cannot exceed 100 characters"));

        var wallet = new Wallet
        {
            Id = WalletId.New(),
            UserId = userId,
            Currency = currency,
            Name = walletName,
            Status = WalletStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        wallet.RaiseDomainEvent(new WalletCreatedEvent(
            wallet.Id,
            wallet.UserId,
            wallet.Currency.Code,
            wallet.Name));

        return Result<Wallet>.Success(wallet);
    }

    public Result Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result.Failure(Error.Validation("Wallet name is required"));

        var trimmedName = name.Trim();
        if (trimmedName.Length > 100)
            return Result.Failure(Error.Validation("Wallet name cannot exceed 100 characters"));

        Name = trimmedName;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public Result Freeze()
    {
        if (Status == WalletStatus.Frozen)
            return Result.Failure(Error.Conflict("Wallet is already frozen"));

        if (Status == WalletStatus.Closed)
            return Result.Failure(Error.Conflict("Cannot freeze a closed wallet"));

        Status = WalletStatus.Frozen;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new WalletFrozenEvent(Id, UserId));

        return Result.Success();
    }

    public Result Unfreeze()
    {
        if (Status != WalletStatus.Frozen)
            return Result.Failure(Error.Conflict("Wallet is not frozen"));

        Status = WalletStatus.Active;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public Result Close()
    {
        if (Status == WalletStatus.Closed)
            return Result.Failure(Error.Conflict("Wallet is already closed"));

        Status = WalletStatus.Closed;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new WalletClosedEvent(Id, UserId));

        return Result.Success();
    }

    public Result CanTransact()
    {
        return Status switch
        {
            WalletStatus.Active => Result.Success(),
            WalletStatus.Frozen => Result.Failure(Error.WalletFrozen()),
            WalletStatus.Closed => Result.Failure(Error.WalletClosed()),
            _ => Result.Failure(Error.Validation("Invalid wallet status"))
        };
    }

    public bool IsOwnedBy(UserId userId)
    {
        return UserId == userId;
    }
}