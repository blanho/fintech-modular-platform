namespace FinTech.SharedKernel.Results;

public record Error(string Code, string Message)
{

public static readonly Error None = new(string.Empty, string.Empty);

public static Error Validation(string message) => new("VALIDATION_ERROR", message);
    public static Error NotFound(string resource) => new("NOT_FOUND", $"{resource} not found");
    public static Error Conflict(string message) => new("CONFLICT", message);
    public static Error Unauthorized(string message = "Unauthorized") => new("UNAUTHORIZED", message);
    public static Error Forbidden(string message = "Forbidden") => new("FORBIDDEN", message);

public static Error InsufficientBalance() => new("INSUFFICIENT_BALANCE", "Insufficient balance for this operation");
    public static Error WalletFrozen() => new("WALLET_FROZEN", "Wallet is frozen");
    public static Error WalletClosed() => new("WALLET_CLOSED", "Wallet is closed");
    public static Error DuplicateTransaction() => new("DUPLICATE_TRANSACTION", "Transaction already processed");
    public static Error InvalidCredentials() => new("INVALID_CREDENTIALS", "Invalid email or password");
    public static Error CurrencyMismatch() => new("CURRENCY_MISMATCH", "Currency mismatch - cannot operate on different currencies");
    public static Error SameWalletTransfer() => new("SAME_WALLET_TRANSFER", "Cannot transfer to the same wallet");
}