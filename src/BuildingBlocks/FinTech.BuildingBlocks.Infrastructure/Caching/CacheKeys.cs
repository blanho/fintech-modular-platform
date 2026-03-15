namespace FinTech.BuildingBlocks.Infrastructure.Caching;

public static class CacheKeys
{
    public static string WalletBalance(Guid walletId)
    {
        return $"wallet:balance:{walletId}";
    }

    public static string UserProfile(Guid userId)
    {
        return $"user:profile:{userId}";
    }

    public static string WalletInfo(Guid walletId)
    {
        return $"wallet:info:{walletId}";
    }

    public static class Wallet
    {
        public static string Balance(Guid walletId)
        {
            return $"wallet:balance:{walletId}";
        }

        public static string Info(Guid walletId)
        {
            return $"wallet:info:{walletId}";
        }
    }

    public static class Ttl
    {
        public static readonly TimeSpan Balance = TimeSpan.FromSeconds(30);
        public static readonly TimeSpan UserProfile = TimeSpan.FromMinutes(5);
    }
}
