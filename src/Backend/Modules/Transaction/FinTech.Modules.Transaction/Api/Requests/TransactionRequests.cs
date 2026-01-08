namespace FinTech.Modules.Transaction.Api.Requests;

public sealed record TransferRequest(
    Guid SourceWalletId,
    Guid TargetWalletId,
    string Amount,
    string Currency,
    string? Description);

public sealed record DepositRequest(
    Guid WalletId,
    string Amount,
    string Currency,
    string? Description);

public sealed record WithdrawRequest(
    Guid WalletId,
    string Amount,
    string Currency,
    string? Description);