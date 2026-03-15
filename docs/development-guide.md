# Development Guide

A practical guide for day-to-day development, adding features, and following project conventions.

---

## Adding a New Backend Module

Every module follows the same 4-project structure. Use an existing module (e.g., Wallet) as a template.

### Step 1 — Scaffold Projects

```
src/Backend/Modules/YourModule/
├── FinTech.Modules.YourModule/               # Domain + Application
│   ├── Domain/
│   │   ├── Entities/
│   │   ├── Enums/
│   │   ├── Events/
│   │   ├── Repositories/                     # IYourEntityRepository.cs
│   │   └── ValueObjects/
│   ├── Application/
│   │   ├── Commands/
│   │   │   └── DoSomething/
│   │   │       ├── DoSomethingCommand.cs
│   │   │       └── DoSomethingCommandHandler.cs
│   │   ├── Queries/
│   │   │   └── GetSomething/
│   │   │       ├── GetSomethingQuery.cs
│   │   │       └── GetSomethingQueryHandler.cs
│   │   ├── Contracts/                        # Integration events
│   │   └── DTOs/
│   ├── Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── YourModuleDbContext.cs
│   │   │   ├── Configurations/               # EF Core fluent configs
│   │   │   └── Repositories/                 # Repository implementations
│   │   ├── Consumers/                        # MassTransit consumers
│   │   └── Services/
│   └── Presentation/
│       └── YourModuleController.cs
```

### Step 2 — Create the `.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\..\Shared\FinTech.SharedKernel\FinTech.SharedKernel.csproj" />
    <ProjectReference Include="..\..\Shared\FinTech.Infrastructure\FinTech.Infrastructure.csproj" />
  </ItemGroup>
</Project>
```

### Step 3 — Register the Module

Create a `YourModuleRegistration.cs`:

```csharp
public static class YourModuleRegistration
{
    public static IServiceCollection AddYourModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<YourModuleDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("Database"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "your_module")));

        // MediatR (auto-registers handlers from this assembly)
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(YourModuleRegistration).Assembly));

        // Repositories
        services.AddScoped<IYourEntityRepository, YourEntityRepository>();

        return services;
    }
}
```

### Step 4 — Wire into Program.cs

In `FinTech.Api/Program.cs`:

```csharp
builder.Services.AddYourModule(builder.Configuration);
```

### Step 5 — Add Database Schema

In `infrastructure/docker/init-db.sql`:

```sql
CREATE SCHEMA IF NOT EXISTS your_module;
-- Your tables here
```

---

## Adding a Command (Write Operation)

Commands represent mutations (create, update, delete). They go through the MediatR pipeline.

### 1. Define the Command

```csharp
// Application/Commands/CreateWidget/CreateWidgetCommand.cs
public sealed record CreateWidgetCommand(
    string Name,
    string Description,
    Guid WalletId) : IRequest<Result<Guid>>;
```

### 2. Add Validation

```csharp
// Application/Commands/CreateWidget/CreateWidgetCommandValidator.cs
public sealed class CreateWidgetCommandValidator
    : AbstractValidator<CreateWidgetCommand>
{
    public CreateWidgetCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.WalletId)
            .NotEmpty();
    }
}
```

### 3. Implement the Handler

```csharp
// Application/Commands/CreateWidget/CreateWidgetCommandHandler.cs
internal sealed class CreateWidgetCommandHandler(
    IWidgetRepository repository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateWidgetCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(
        CreateWidgetCommand request,
        CancellationToken cancellationToken)
    {
        var widget = Widget.Create(request.Name, request.Description, request.WalletId);

        repository.Add(widget);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(widget.Id);
    }
}
```

### 4. Expose via Controller

```csharp
[HttpPost]
public async Task<IActionResult> Create(
    [FromBody] CreateWidgetRequest request,
    CancellationToken cancellationToken)
{
    var command = new CreateWidgetCommand(request.Name, request.Description, request.WalletId);
    var result = await _sender.Send(command, cancellationToken);

    return result.IsSuccess
        ? CreatedAtAction(nameof(GetById), new { id = result.Value }, result.Value)
        : result.ToProblemDetails();
}
```

---

## Adding a Query (Read Operation)

```csharp
// Query
public sealed record GetWidgetQuery(Guid WidgetId) : IRequest<Result<WidgetResponse>>;

// Handler
internal sealed class GetWidgetQueryHandler(IWidgetRepository repository)
    : IRequestHandler<GetWidgetQuery, Result<WidgetResponse>>
{
    public async Task<Result<WidgetResponse>> Handle(
        GetWidgetQuery request,
        CancellationToken cancellationToken)
    {
        var widget = await repository.GetByIdAsync(request.WidgetId, cancellationToken);

        return widget is null
            ? Result.Failure<WidgetResponse>(WidgetErrors.NotFound(request.WidgetId))
            : Result.Success(widget.ToResponse());
    }
}
```

---

## Adding an Integration Event

Integration events enable cross-module communication via RabbitMQ/MassTransit.

### 1. Define the Contract

Place in the publisher's `Contracts/` folder (referenced by consumers):

```csharp
// Modules/Wallet/Application/Contracts/WalletCreatedIntegrationEvent.cs
public sealed record WalletCreatedIntegrationEvent(
    Guid WalletId,
    Guid UserId,
    string Currency,
    DateTime CreatedAt);
```

### 2. Publish from Domain Event Handler

```csharp
internal sealed class WalletCreatedDomainEventHandler(IPublishEndpoint publishEndpoint)
    : INotificationHandler<WalletCreatedDomainEvent>
{
    public async Task Handle(
        WalletCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        await publishEndpoint.Publish(
            new WalletCreatedIntegrationEvent(
                notification.WalletId,
                notification.UserId,
                notification.Currency,
                notification.OccurredAt),
            cancellationToken);
    }
}
```

### 3. Add a Consumer in Another Module

```csharp
// Modules/Ledger/Infrastructure/Consumers/WalletCreatedConsumer.cs
public sealed class WalletCreatedConsumer(ISender sender)
    : IConsumer<WalletCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<WalletCreatedIntegrationEvent> context)
    {
        var command = new InitializeLedgerCommand(
            context.Message.WalletId,
            context.Message.Currency);

        await sender.Send(command);
    }
}
```

### 4. Register Consumer

In the module registration:

```csharp
services.AddMassTransit(cfg =>
{
    cfg.AddConsumer<WalletCreatedConsumer>();
});
```

---

## MediatR Pipeline Behaviors

Every command/query passes through these behaviors (in order):

| Order | Behavior | Purpose |
|-------|----------|---------|
| 1 | `LoggingBehavior` | Logs request start/end with elapsed time |
| 2 | `ValidationBehavior` | Runs FluentValidation rules, short-circuits on failure |

To add a new behavior, implement `IPipelineBehavior<TRequest, TResponse>` and register in `FinTech.Infrastructure/Extensions`.

---

## Writing Tests

### Unit Tests

Located in `tests/Backend/Unit/FinTech.Tests.Unit/`.

Test domain logic in isolation:

```csharp
public class WalletTests
{
    [Fact]
    public void Create_ValidParameters_ReturnsWallet()
    {
        var wallet = Wallet.Create("Main", Currency.USD, Guid.NewGuid());

        Assert.NotNull(wallet);
        Assert.Equal("Main", wallet.Name);
        Assert.Equal(WalletStatus.Active, wallet.Status);
    }

    [Fact]
    public void Freeze_ActiveWallet_StatusChangesToFrozen()
    {
        var wallet = Wallet.Create("Main", Currency.USD, Guid.NewGuid());

        wallet.Freeze();

        Assert.Equal(WalletStatus.Frozen, wallet.Status);
    }
}
```

### Integration Tests

Located in `tests/Backend/Integration/FinTech.Tests.Integration/`.

Test full request pipelines against real infrastructure (use Testcontainers):

```csharp
public class WalletEndpointTests : IClassFixture<WebAppFactory>
{
    private readonly HttpClient _client;

    public WalletEndpointTests(WebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateWallet_ValidRequest_Returns201()
    {
        // Arrange — login, get token
        // Act — POST /api/v1/wallets
        // Assert — 201 + wallet id
    }
}
```

### Architecture Tests

Located in `tests/Backend/Architecture/FinTech.Tests.Architecture/`.

Enforce structural rules:

```csharp
[Fact]
public void Domain_ShouldNotDependOn_Infrastructure()
{
    var result = Types.InAssembly(typeof(Wallet).Assembly)
        .ShouldNot()
        .HaveDependencyOn("FinTech.Infrastructure")
        .GetResult();

    Assert.True(result.IsSuccessful);
}
```

### Running Tests

```bash
# All tests
dotnet test

# Specific project
dotnet test tests/Backend/Unit/FinTech.Tests.Unit/

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

---

## Coding Standards

### General Rules

- **Primary constructors** — use for DI injection (no explicit `private readonly` fields)
- **Records** — use for commands, queries, DTOs, integration events
- **Sealed classes** — seal all classes unless designed for inheritance
- **Internal handlers** — command/query handlers are `internal sealed`
- **File-scoped namespaces** — always use `namespace X;` (not block style)
- **No `this.`** — never prefix with `this.`

### Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Command | `VerbNounCommand` | `CreateWalletCommand` |
| Query | `GetNounQuery` | `GetWalletByIdQuery` |
| Handler | `CommandNameHandler` | `CreateWalletCommandHandler` |
| Validator | `CommandNameValidator` | `CreateWalletCommandValidator` |
| Controller | `ModuleNameController` | `WalletsController` |
| Consumer | `EventNameConsumer` | `WalletCreatedConsumer` |
| Repository | `INounRepository` | `IWalletRepository` |
| Domain Event | `NounVerbedDomainEvent` | `WalletCreatedDomainEvent` |
| Integration Event | `NounVerbedIntegrationEvent` | `WalletCreatedIntegrationEvent` |
| DB Config | `NounConfiguration` | `WalletConfiguration` |

### Domain Entity Rules

- Entities inherit from `Entity` (has `Id` + domain events)
- Aggregate roots inherit from `AggregateRoot`
- Use factory methods (`Create(...)`) instead of public constructors
- Private setters — mutations through methods only
- Raise domain events from within the entity

### Result Pattern

Never throw exceptions for business logic. Use the `Result<T>` pattern:

```csharp
// Success
return Result.Success(value);

// Failure
return Result.Failure<T>(Error.Validation("Field", "Message"));
```

---

## Git Workflow

### Branch Naming

```
feature/module-short-description    # feature/wallet-freeze-endpoint
bugfix/module-short-description     # bugfix/transaction-amount-rounding
docs/topic                          # docs/api-reference
infra/topic                         # infra/docker-health-checks
```

### Commit Messages

Follow conventional commits:

```
feat(wallet): add freeze and unfreeze endpoints
fix(transaction): correct decimal rounding for transfers
docs: update API reference with ledger endpoints
infra: add Redis health check to docker compose
test(wallet): add unit tests for freeze domain logic
refactor(identity): extract token service interface
```

### PR Checklist

- [ ] Code compiles (`dotnet build`)
- [ ] All tests pass (`dotnet test`)
- [ ] Frontend compiles (`npm run build`)
- [ ] New endpoints documented
- [ ] New migration added (if schema changed)
- [ ] No hardcoded secrets or connection strings
