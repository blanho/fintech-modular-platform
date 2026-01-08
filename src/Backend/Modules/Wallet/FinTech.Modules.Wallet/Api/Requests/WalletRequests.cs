namespace FinTech.Modules.Wallet.Api.Requests;

public sealed record CreateWalletRequest(
    string Currency,
    string? Name
);

public sealed record RenameWalletRequest(
    string Name
);