FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS restore
WORKDIR /src

COPY FinTech.sln ./
COPY Directory.Build.props ./

COPY src/BuildingBlocks/FinTech.BuildingBlocks.Domain/FinTech.BuildingBlocks.Domain.csproj                       src/BuildingBlocks/FinTech.BuildingBlocks.Domain/
COPY src/BuildingBlocks/FinTech.BuildingBlocks.Application/FinTech.BuildingBlocks.Application.csproj             src/BuildingBlocks/FinTech.BuildingBlocks.Application/
COPY src/BuildingBlocks/FinTech.BuildingBlocks.Infrastructure/FinTech.BuildingBlocks.Infrastructure.csproj       src/BuildingBlocks/FinTech.BuildingBlocks.Infrastructure/
COPY src/BuildingBlocks/FinTech.BuildingBlocks.EventBus/FinTech.BuildingBlocks.EventBus.csproj                   src/BuildingBlocks/FinTech.BuildingBlocks.EventBus/
COPY src/BuildingBlocks/FinTech.BuildingBlocks.Observability/FinTech.BuildingBlocks.Observability.csproj         src/BuildingBlocks/FinTech.BuildingBlocks.Observability/

COPY src/Modules/Identity/FinTech.Modules.Identity.Domain/FinTech.Modules.Identity.Domain.csproj                src/Modules/Identity/FinTech.Modules.Identity.Domain/
COPY src/Modules/Identity/FinTech.Modules.Identity.Application/FinTech.Modules.Identity.Application.csproj      src/Modules/Identity/FinTech.Modules.Identity.Application/
COPY src/Modules/Identity/FinTech.Modules.Identity.Infrastructure/FinTech.Modules.Identity.Infrastructure.csproj src/Modules/Identity/FinTech.Modules.Identity.Infrastructure/
COPY src/Modules/Identity/FinTech.Modules.Identity.Api/FinTech.Modules.Identity.Api.csproj                      src/Modules/Identity/FinTech.Modules.Identity.Api/

COPY src/Modules/Wallet/FinTech.Modules.Wallet.Domain/FinTech.Modules.Wallet.Domain.csproj                     src/Modules/Wallet/FinTech.Modules.Wallet.Domain/
COPY src/Modules/Wallet/FinTech.Modules.Wallet.Application/FinTech.Modules.Wallet.Application.csproj            src/Modules/Wallet/FinTech.Modules.Wallet.Application/
COPY src/Modules/Wallet/FinTech.Modules.Wallet.Infrastructure/FinTech.Modules.Wallet.Infrastructure.csproj      src/Modules/Wallet/FinTech.Modules.Wallet.Infrastructure/
COPY src/Modules/Wallet/FinTech.Modules.Wallet.Api/FinTech.Modules.Wallet.Api.csproj                            src/Modules/Wallet/FinTech.Modules.Wallet.Api/

COPY src/Modules/Ledger/FinTech.Modules.Ledger.Domain/FinTech.Modules.Ledger.Domain.csproj                     src/Modules/Ledger/FinTech.Modules.Ledger.Domain/
COPY src/Modules/Ledger/FinTech.Modules.Ledger.Application/FinTech.Modules.Ledger.Application.csproj            src/Modules/Ledger/FinTech.Modules.Ledger.Application/
COPY src/Modules/Ledger/FinTech.Modules.Ledger.Infrastructure/FinTech.Modules.Ledger.Infrastructure.csproj      src/Modules/Ledger/FinTech.Modules.Ledger.Infrastructure/
COPY src/Modules/Ledger/FinTech.Modules.Ledger.Api/FinTech.Modules.Ledger.Api.csproj                            src/Modules/Ledger/FinTech.Modules.Ledger.Api/

COPY src/Modules/Transaction/FinTech.Modules.Transaction.Domain/FinTech.Modules.Transaction.Domain.csproj       src/Modules/Transaction/FinTech.Modules.Transaction.Domain/
COPY src/Modules/Transaction/FinTech.Modules.Transaction.Application/FinTech.Modules.Transaction.Application.csproj src/Modules/Transaction/FinTech.Modules.Transaction.Application/
COPY src/Modules/Transaction/FinTech.Modules.Transaction.Infrastructure/FinTech.Modules.Transaction.Infrastructure.csproj src/Modules/Transaction/FinTech.Modules.Transaction.Infrastructure/
COPY src/Modules/Transaction/FinTech.Modules.Transaction.Api/FinTech.Modules.Transaction.Api.csproj              src/Modules/Transaction/FinTech.Modules.Transaction.Api/

COPY src/Modules/Notification/FinTech.Modules.Notification.Domain/FinTech.Modules.Notification.Domain.csproj     src/Modules/Notification/FinTech.Modules.Notification.Domain/
COPY src/Modules/Notification/FinTech.Modules.Notification.Application/FinTech.Modules.Notification.Application.csproj src/Modules/Notification/FinTech.Modules.Notification.Application/
COPY src/Modules/Notification/FinTech.Modules.Notification.Infrastructure/FinTech.Modules.Notification.Infrastructure.csproj src/Modules/Notification/FinTech.Modules.Notification.Infrastructure/
COPY src/Modules/Notification/FinTech.Modules.Notification.Api/FinTech.Modules.Notification.Api.csproj            src/Modules/Notification/FinTech.Modules.Notification.Api/

COPY src/Modules/Audit/FinTech.Modules.Audit.Domain/FinTech.Modules.Audit.Domain.csproj                         src/Modules/Audit/FinTech.Modules.Audit.Domain/
COPY src/Modules/Audit/FinTech.Modules.Audit.Application/FinTech.Modules.Audit.Application.csproj                src/Modules/Audit/FinTech.Modules.Audit.Application/
COPY src/Modules/Audit/FinTech.Modules.Audit.Infrastructure/FinTech.Modules.Audit.Infrastructure.csproj          src/Modules/Audit/FinTech.Modules.Audit.Infrastructure/
COPY src/Modules/Audit/FinTech.Modules.Audit.Api/FinTech.Modules.Audit.Api.csproj                                src/Modules/Audit/FinTech.Modules.Audit.Api/

COPY src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Domain/FinTech.Modules.BackgroundJob.Domain.csproj   src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Domain/
COPY src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Application/FinTech.Modules.BackgroundJob.Application.csproj src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Application/
COPY src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Infrastructure/FinTech.Modules.BackgroundJob.Infrastructure.csproj src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Infrastructure/
COPY src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Api/FinTech.Modules.BackgroundJob.Api.csproj          src/Modules/BackgroundJob/FinTech.Modules.BackgroundJob.Api/

COPY src/Modules/Report/FinTech.Modules.Report.Domain/FinTech.Modules.Report.Domain.csproj                       src/Modules/Report/FinTech.Modules.Report.Domain/
COPY src/Modules/Report/FinTech.Modules.Report.Application/FinTech.Modules.Report.Application.csproj              src/Modules/Report/FinTech.Modules.Report.Application/
COPY src/Modules/Report/FinTech.Modules.Report.Infrastructure/FinTech.Modules.Report.Infrastructure.csproj        src/Modules/Report/FinTech.Modules.Report.Infrastructure/
COPY src/Modules/Report/FinTech.Modules.Report.Api/FinTech.Modules.Report.Api.csproj                              src/Modules/Report/FinTech.Modules.Report.Api/

COPY src/Host/FinTech.Api/FinTech.Api.csproj src/Host/FinTech.Api/

COPY tests/Backend/Unit/FinTech.Tests.Unit/FinTech.Tests.Unit.csproj                     tests/Backend/Unit/FinTech.Tests.Unit/
COPY tests/Backend/Integration/FinTech.Tests.Integration/FinTech.Tests.Integration.csproj tests/Backend/Integration/FinTech.Tests.Integration/
COPY tests/Backend/Architecture/FinTech.Tests.Architecture/FinTech.Tests.Architecture.csproj tests/Backend/Architecture/FinTech.Tests.Architecture/

RUN dotnet restore FinTech.sln

FROM restore AS build
ARG BUILD_CONFIGURATION=Release

COPY src/ src/
COPY tests/ tests/

RUN dotnet publish src/Host/FinTech.Api/FinTech.Api.csproj \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && apk add --no-cache curl

COPY --from=build /app/publish .

USER appuser

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

HEALTHCHECK --interval=15s --timeout=5s --retries=3 --start-period=30s \
    CMD curl -f http://localhost:8080/health/live || exit 1

ENTRYPOINT ["dotnet", "FinTech.Api.dll"]
