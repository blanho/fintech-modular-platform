namespace FinTech.BuildingBlocks.Infrastructure.Caching;

public static class CacheKeys
{
    public static string WalletBalance(Guid walletId) => $"wallet:balance:{walletId}";
    public static string UserProfile(Guid userId) => $"user:profile:{userId}";
    public static string WalletInfo(Guid walletId) => $"wallet:info:{walletId}";
}
