using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.BuildingBlocks.EventBus;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Transaction.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Transaction.Application.Commands.Transfer;

public sealed class TransferCommandHandler : IRequestHandler<TransferCommand, Result<TransferResponse>>
{
    private readonly IEventPublisher _eventPublisher;
    private readonly ILedgerService _ledgerService;
    private readonly ILogger<TransferCommandHandler> _logger;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletService _walletService;

    public TransferCommandHandler(
        ITransactionRepository transactionRepository,
        IWalletService walletService,
        ILedgerService ledgerService,
        IEventPublisher eventPublisher,
        ILogger<TransferCommandHandler> logger)
    {
        _transactionRepository = transactionRepository;
        _walletService = walletService;
        _ledgerService = ledgerService;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<Result<TransferResponse>> Handle(
        TransferCommand request,
        CancellationToken cancellationToken)
    {
        var sourceWalletId = new WalletId(request.SourceWalletId);
        var targetWalletId = new WalletId(request.TargetWalletId);

        if (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            var existingTransaction = await _transactionRepository.GetByIdempotencyKeyAsync(
                request.IdempotencyKey, cancellationToken);

            if (existingTransaction != null)
                return Result<TransferResponse>.Success(MapToResponse(existingTransaction));
        }

        var sourceWalletResult = await _walletService.GetWalletInfoAsync(sourceWalletId, cancellationToken);
        if (sourceWalletResult.IsFailure)
            return Result<TransferResponse>.Failure(Error.NotFound("Source wallet"));

        var canTransactSource = await _walletService.CanTransactAsync(sourceWalletId, cancellationToken);
        if (canTransactSource.IsFailure)
            return Result<TransferResponse>.Failure(canTransactSource.Error);

        var targetWalletResult = await _walletService.GetWalletInfoAsync(targetWalletId, cancellationToken);
        if (targetWalletResult.IsFailure)
            return Result<TransferResponse>.Failure(Error.NotFound("Target wallet"));

        var canTransactTarget = await _walletService.CanTransactAsync(targetWalletId, cancellationToken);
        if (canTransactTarget.IsFailure)
            return Result<TransferResponse>.Failure(canTransactTarget.Error);

        if (sourceWalletResult.Value!.Currency != request.Currency)
            return Result<TransferResponse>.Failure(
                Error.Validation(
                    $"Currency mismatch: wallet uses {sourceWalletResult.Value.Currency}, request uses {request.Currency}"));

        if (targetWalletResult.Value!.Currency != request.Currency)
            return Result<TransferResponse>.Failure(
                Error.Validation(
                    $"Target wallet currency mismatch: wallet uses {targetWalletResult.Value.Currency}, request uses {request.Currency}"));

        var moneyResult = Money.Create(request.Amount, request.Currency);
        if (moneyResult.IsFailure)
            return Result<TransferResponse>.Failure(moneyResult.Error);

        var transactionResult = Domain.Entities.Transaction.CreateTransfer(
            sourceWalletId,
            targetWalletId,
            moneyResult.Value!,
            request.Description,
            request.IdempotencyKey);

        if (transactionResult.IsFailure)
            return Result<TransferResponse>.Failure(transactionResult.Error);

        var transaction = transactionResult.Value!;

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        var hasSufficientBalance = await _ledgerService.HasSufficientBalanceAsync(
            sourceWalletId, moneyResult.Value!, cancellationToken);

        if (hasSufficientBalance.IsFailure || !hasSufficientBalance.Value)
        {
            transaction.Fail("Insufficient balance");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<TransferResponse>.Failure(Error.InsufficientBalance());
        }

        var debitResult = await _ledgerService.AppendDebitAsync(
            sourceWalletId,
            moneyResult.Value!,
            transaction.Id,
            $"Transfer to wallet {targetWalletId.Value:N}",
            cancellationToken);

        if (debitResult.IsFailure)
        {
            transaction.Fail($"Failed to create debit entry: {debitResult.Error.Message}");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<TransferResponse>.Failure(debitResult.Error);
        }

        var creditResult = await _ledgerService.AppendCreditAsync(
            targetWalletId,
            moneyResult.Value!,
            transaction.Id,
            $"Transfer from wallet {sourceWalletId.Value:N}",
            cancellationToken);

        if (creditResult.IsFailure)
        {
            transaction.Fail($"Failed to create credit entry: {creditResult.Error.Message}");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<TransferResponse>.Failure(creditResult.Error);
        }

        var completeResult = transaction.Complete();
        if (completeResult.IsFailure)
            return Result<TransferResponse>.Failure(completeResult.Error);

        _transactionRepository.Update(transaction);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        try
        {
            var integrationEvent = new TransactionCompletedIntegrationEvent(
                transaction.Id.Value,
                transaction.SourceWalletId.Value,
                transaction.TargetWalletId!.Value,
                transaction.Amount.Amount,
                transaction.Amount.Currency.Code,
                "Transfer",
                transaction.CompletedAt!.Value);

            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);

            _logger.LogInformation(
                "Published TransactionCompletedIntegrationEvent for transaction {TransactionId}",
                transaction.Id);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Failed to publish integration event for transaction {TransactionId}",
                transaction.Id);
        }

        return Result<TransferResponse>.Success(MapToResponse(transaction));
    }

    private static TransferResponse MapToResponse(Domain.Entities.Transaction transaction)
    {
        return new TransferResponse(
            transaction.Id.Value,
            transaction.Type.ToString().ToLowerInvariant(),
            transaction.Status.ToString().ToLowerInvariant(),
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId.Value,
            transaction.TargetWalletId!.Value,
            transaction.Description,
            transaction.IdempotencyKey,
            transaction.CreatedAt,
            transaction.CompletedAt);
    }
}