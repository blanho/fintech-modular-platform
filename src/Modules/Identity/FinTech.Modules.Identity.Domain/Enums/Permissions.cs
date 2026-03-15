namespace FinTech.Modules.Identity.Domain.Enums;

public static class Permissions
{
    public const string UsersRead = "users:read";
    public const string UsersWrite = "users:write";
    public const string UsersManage = "users:manage";

    public const string WalletsRead = "wallets:read";
    public const string WalletsWrite = "wallets:write";
    public const string WalletsManage = "wallets:manage";

    public const string TransactionsRead = "transactions:read";
    public const string TransactionsWrite = "transactions:write";
    public const string TransactionsManage = "transactions:manage";

    public const string AuditRead = "audit:read";
    public const string AuditExport = "audit:export";

    public const string ReportsRead = "reports:read";
    public const string ReportsExport = "reports:export";

    public const string SystemManage = "system:manage";

    public static readonly IReadOnlySet<string> All = new HashSet<string>
    {
        UsersRead, UsersWrite, UsersManage,
        WalletsRead, WalletsWrite, WalletsManage,
        TransactionsRead, TransactionsWrite, TransactionsManage,
        AuditRead, AuditExport,
        ReportsRead, ReportsExport,
        SystemManage
    };

    public static IReadOnlyList<string> GetPermissionsForRole(RoleType role)
    {
        return role switch
        {
            RoleType.Admin => new[]
            {
                UsersRead, UsersWrite, UsersManage,
                WalletsRead, WalletsWrite, WalletsManage,
                TransactionsRead, TransactionsWrite, TransactionsManage,
                AuditRead, AuditExport,
                ReportsRead, ReportsExport,
                SystemManage
            },
            RoleType.User => new[]
            {
                UsersRead,
                WalletsRead, WalletsWrite,
                TransactionsRead, TransactionsWrite,
                ReportsRead
            },
            RoleType.Auditor => new[]
            {
                UsersRead,
                WalletsRead,
                TransactionsRead,
                AuditRead, AuditExport,
                ReportsRead, ReportsExport
            },
            RoleType.Support => new[]
            {
                UsersRead, UsersWrite,
                WalletsRead,
                TransactionsRead,
                AuditRead,
                ReportsRead
            },
            _ => Array.Empty<string>()
        };
    }
}
