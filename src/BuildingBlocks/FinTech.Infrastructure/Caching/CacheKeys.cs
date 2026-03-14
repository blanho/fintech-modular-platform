namespace FinTech.Infrastructure.Caching;

public static class CacheKeys
{
    private const string Prefix = "fintech";

public static class Wallet
    {

public static string Balance(Guid walletId) => $"{Prefix}:wallet:{walletId}:balance";

public static string Details(Guid walletId) => $"{Prefix}:wallet:{walletId}:details";

public static string UserWallets(Guid userId) => $"{Prefix}:user:{userId}:wallets";
    }

public static class User
    {

public static string Profile(Guid userId) => $"{Prefix}:user:{userId}:profile";

public static string Preferences(Guid userId) => $"{Prefix}:user:{userId}:preferences";
    }

public static class RateLimit
    {

public static string Counter(string endpoint, string clientId) => $"{Prefix}:ratelimit:{endpoint}:{clientId}";
    }

public static class Idempotency
    {

public static string Response(string idempotencyKey) => $"{Prefix}:idempotency:{idempotencyKey}";
    }

public static class Ttl
    {
        public static readonly TimeSpan Balance = TimeSpan.FromSeconds(30);
        public static readonly TimeSpan WalletDetails = TimeSpan.FromMinutes(5);
        public static readonly TimeSpan UserWallets = TimeSpan.FromMinutes(2);
        public static readonly TimeSpan UserProfile = TimeSpan.FromMinutes(10);
        public static readonly TimeSpan Idempotency = TimeSpan.FromHours(24);
    }
}