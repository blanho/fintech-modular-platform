using System.Reflection;
using FluentAssertions;
using NetArchTest.Rules;

namespace FinTech.Tests.Architecture;

public class CleanArchitectureTests
{
    private static Assembly GetAssembly(string moduleName, string layer)
        => Assembly.Load($"FinTech.Modules.{moduleName}.{layer}");

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Domain_Should_Not_Depend_On_Application(string module)
    {
        var domainAssembly = GetAssembly(module, "Domain");
        var applicationNamespace = $"FinTech.Modules.{module}.Application";

        var result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOn(applicationNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Domain layer of {module} should not depend on Application layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Domain_Should_Not_Depend_On_Infrastructure(string module)
    {
        var domainAssembly = GetAssembly(module, "Domain");
        var infrastructureNamespace = $"FinTech.Modules.{module}.Infrastructure";

        var result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOn(infrastructureNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Domain layer of {module} should not depend on Infrastructure layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Domain_Should_Not_Depend_On_Api(string module)
    {
        var domainAssembly = GetAssembly(module, "Domain");
        var apiNamespace = $"FinTech.Modules.{module}.Api";

        var result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOn(apiNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Domain layer of {module} should not depend on Api layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Application_Should_Not_Depend_On_Infrastructure(string module)
    {
        var applicationAssembly = GetAssembly(module, "Application");
        var infrastructureNamespace = $"FinTech.Modules.{module}.Infrastructure";

        var result = Types.InAssembly(applicationAssembly)
            .ShouldNot()
            .HaveDependencyOn(infrastructureNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Application layer of {module} should not depend on Infrastructure layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Application_Should_Not_Depend_On_Api(string module)
    {
        var applicationAssembly = GetAssembly(module, "Application");
        var apiNamespace = $"FinTech.Modules.{module}.Api";

        var result = Types.InAssembly(applicationAssembly)
            .ShouldNot()
            .HaveDependencyOn(apiNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Application layer of {module} should not depend on Api layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }

    [Theory]
    [InlineData("Identity")]
    [InlineData("Wallet")]
    [InlineData("Ledger")]
    [InlineData("Transaction")]
    [InlineData("Notification")]
    [InlineData("Audit")]
    [InlineData("BackgroundJob")]
    [InlineData("Report")]
    public void Infrastructure_Should_Not_Depend_On_Api(string module)
    {
        var infrastructureAssembly = GetAssembly(module, "Infrastructure");
        var apiNamespace = $"FinTech.Modules.{module}.Api";

        var result = Types.InAssembly(infrastructureAssembly)
            .ShouldNot()
            .HaveDependencyOn(apiNamespace)
            .GetResult();

        result.IsSuccessful.Should().BeTrue(
            $"Infrastructure layer of {module} should not depend on Api layer. " +
            $"Failing types: {string.Join(", ", result.FailingTypeNames ?? [])}");
    }
}
