namespace FinTech.BuildingBlocks.Domain.Results;

public record Error(string Code, string Message)
{
    public static readonly Error None = new(string.Empty, string.Empty);

    public static Error Validation(string message)
    {
        return new Error("VALIDATION_ERROR", message);
    }

    public static Error NotFound(string resource)
    {
        return new Error("NOT_FOUND", $"{resource} not found");
    }

    public static Error Conflict(string message)
    {
        return new Error("CONFLICT", message);
    }

    public static Error Unauthorized(string message = "Unauthorized")
    {
        return new Error("UNAUTHORIZED", message);
    }

    public static Error Forbidden(string message = "Forbidden")
    {
        return new Error("FORBIDDEN", message);
    }

    public static Error InsufficientBalance()
    {
        return new Error("INSUFFICIENT_BALANCE", "Insufficient balance for this operation");
    }

    public static Error WalletFrozen()
    {
        return new Error("WALLET_FROZEN", "Wallet is frozen");
    }

    public static Error WalletClosed()
    {
        return new Error("WALLET_CLOSED", "Wallet is closed");
    }

    public static Error DuplicateTransaction()
    {
        return new Error("DUPLICATE_TRANSACTION", "Transaction already processed");
    }

    public static Error InvalidCredentials()
    {
        return new Error("INVALID_CREDENTIALS", "Invalid email or password");
    }

    public static Error CurrencyMismatch()
    {
        return new Error("CURRENCY_MISMATCH", "Currency mismatch - cannot operate on different currencies");
    }

    public static Error SameWalletTransfer()
    {
        return new Error("SAME_WALLET_TRANSFER", "Cannot transfer to the same wallet");
    }
}
