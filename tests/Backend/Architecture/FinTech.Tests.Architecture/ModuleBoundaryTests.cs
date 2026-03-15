using System.Reflection;
using FluentAssertions;
using NetArchTest.Rules;

namespace FinTech.Tests.Architecture;

public class ModuleBoundaryTests
{
    private static Assembly GetAssembly(string moduleName, string layer)
        => Assembly.Load($"FinTech.Modules.{moduleName}.{layer}");

    [Theory]
    [InlineData("Identity", "Wallet")]
    [InlineData("Identity", "Ledger")]
    [InlineData("Identity", "Transaction")]
    [InlineData("Identity", "Notification")]
    [InlineData("Identity", "Audit")]
    [InlineData("Identity", "BackgroundJob")]
    [InlineData("Wallet", "Identity")]
    [InlineData("Wallet", "Ledger")]
    [InlineData("Wallet", "Transaction")]
    [InlineData("Wallet", "Notification")]
    [InlineData("Wallet", "Audit")]
    [InlineData("Wallet", "BackgroundJob")]
    [InlineData("Ledger", "Identity")]
    [InlineData("Ledger", "Wallet")]
    [InlineData("Ledger", "Transaction")]
    [InlineData("Ledger", "Notification")]
    [InlineData("Ledger", "Audit")]
    [InlineData("Ledger", "BackgroundJob")]
    [InlineData("Transaction", "Identity")]
    [InlineData("Transaction", "Wallet")]
    [InlineData("Transaction", "Notification")]
    [InlineData("Transaction", "Audit")]
    [InlineData("Transaction", "BackgroundJob")]
    [InlineData("Notification", "Identity")]
    [InlineData("Notification", "Wallet")]
    [InlineData("Notification", "Transaction")]
    [InlineData("Notification", "Audit")]
    [InlineData("Notification", "BackgroundJob")]
    [InlineData("Audit", "Identity")]
    [InlineData("Audit", "Wallet")]
    [InlineData("Audit", "Ledger")]
    [InlineData("Audit", "Transaction")]
    [InlineData("Audit", "Notification")]
    [InlineData("Audit", "BackgroundJob")]
    [InlineData("BackgroundJob", "Identity")]
    [InlineData("BackgroundJob", "Wallet")]
    [InlineData("BackgroundJob", "Ledger")]
    [InlineData("BackgroundJob", "Transaction")]
    [InlineData("BackgroundJob", "Notification")]
    [InlineData("BackgroundJob", "Audit")]
    public void Module_Domain_Should_Not_Depend_On_Other_Module(string module, string otherModule)
    {
        var domainAssembly = GetAssembly(module, "Domain");
        var otherModuleNamespace = $"FinTech.Modules.{otherModule}";

        var result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                $"{otherModuleNamespace}.Domain",
                $"{otherModuleNamespace}.Application",
                $"{otherModuleNamespace}.Infrastructure",
                $"{otherModuleNamespace}.Api")
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"{module}.Domain should not depend on {otherModule} module. " +
            $"Modules must communicate via integration events only. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity", "Wallet")]
    [InlineData("Identity", "Ledger")]
    [InlineData("Identity", "Transaction")]
    [InlineData("Identity", "Notification")]
    [InlineData("Identity", "Audit")]
    [InlineData("Identity", "BackgroundJob")]
    [InlineData("Wallet", "Identity")]
    [InlineData("Wallet", "Ledger")]
    [InlineData("Wallet", "Transaction")]
    [InlineData("Wallet", "Notification")]
    [InlineData("Wallet", "Audit")]
    [InlineData("Wallet", "BackgroundJob")]
    [InlineData("Ledger", "Identity")]
    [InlineData("Ledger", "Wallet")]
    [InlineData("Ledger", "Transaction")]
    [InlineData("Ledger", "Notification")]
    [InlineData("Ledger", "Audit")]
    [InlineData("Ledger", "BackgroundJob")]
    [InlineData("Transaction", "Identity")]
    [InlineData("Transaction", "Wallet")]
    [InlineData("Transaction", "Notification")]
    [InlineData("Transaction", "Audit")]
    [InlineData("Transaction", "BackgroundJob")]
    [InlineData("Notification", "Identity")]
    [InlineData("Notification", "Wallet")]
    [InlineData("Notification", "Transaction")]
    [InlineData("Notification", "Audit")]
    [InlineData("Notification", "BackgroundJob")]
    [InlineData("Audit", "Identity")]
    [InlineData("Audit", "Wallet")]
    [InlineData("Audit", "Ledger")]
    [InlineData("Audit", "Transaction")]
    [InlineData("Audit", "Notification")]
    [InlineData("Audit", "BackgroundJob")]
    [InlineData("BackgroundJob", "Identity")]
    [InlineData("BackgroundJob", "Wallet")]
    [InlineData("BackgroundJob", "Ledger")]
    [InlineData("BackgroundJob", "Transaction")]
    [InlineData("BackgroundJob", "Notification")]
    [InlineData("BackgroundJob", "Audit")]
    public void Module_Application_Should_Not_Depend_On_Other_Module(string module, string otherModule)
    {
        var applicationAssembly = GetAssembly(module, "Application");
        var otherModuleNamespace = $"FinTech.Modules.{otherModule}";

        var result = Types.InAssembly(applicationAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                $"{otherModuleNamespace}.Domain",
                $"{otherModuleNamespace}.Application",
                $"{otherModuleNamespace}.Infrastructure",
                $"{otherModuleNamespace}.Api")
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"{module}.Application should not depend on {otherModule} module. " +
            $"Modules must communicate via integration events only. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }
}
