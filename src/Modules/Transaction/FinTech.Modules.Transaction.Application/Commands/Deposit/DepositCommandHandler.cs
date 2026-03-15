using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Transaction.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Commands.Deposit;

public sealed class DepositCommandHandler : IRequestHandler<DepositCommand, Result<DepositResponse>>
{
    private readonly ILedgerService _ledgerService;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletService _walletService;

    public DepositCommandHandler(
        ITransactionRepository transactionRepository,
        IWalletService walletService,
        ILedgerService ledgerService)
    {
        _transactionRepository = transactionRepository;
        _walletService = walletService;
        _ledgerService = ledgerService;
    }

    public async Task<Result<DepositResponse>> Handle(
        DepositCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);

        if (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            var existingTransaction = await _transactionRepository.GetByIdempotencyKeyAsync(
                request.IdempotencyKey, cancellationToken);

            if (existingTransaction != null) return Result<DepositResponse>.Success(MapToResponse(existingTransaction));
        }

        var walletResult = await _walletService.GetWalletInfoAsync(walletId, cancellationToken);
        if (walletResult.IsFailure)
            return Result<DepositResponse>.Failure(Error.NotFound("Wallet"));

        var canTransact = await _walletService.CanTransactAsync(walletId, cancellationToken);
        if (canTransact.IsFailure)
            return Result<DepositResponse>.Failure(canTransact.Error);

        if (walletResult.Value!.Currency != request.Currency)
            return Result<DepositResponse>.Failure(
                Error.Validation(
                    $"Currency mismatch: wallet uses {walletResult.Value.Currency}, request uses {request.Currency}"));

        var moneyResult = Money.Create(request.Amount, request.Currency);
        if (moneyResult.IsFailure)
            return Result<DepositResponse>.Failure(moneyResult.Error);

        var transactionResult = Domain.Entities.Transaction.CreateDeposit(
            walletId,
            moneyResult.Value!,
            request.Description,
            request.IdempotencyKey);

        if (transactionResult.IsFailure)
            return Result<DepositResponse>.Failure(transactionResult.Error);

        var transaction = transactionResult.Value!;

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        var creditResult = await _ledgerService.AppendCreditAsync(
            walletId,
            moneyResult.Value!,
            transaction.Id,
            request.Description ?? "Deposit",
            cancellationToken);

        if (creditResult.IsFailure)
        {
            transaction.Fail($"Failed to create credit entry: {creditResult.Error.Message}");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<DepositResponse>.Failure(creditResult.Error);
        }

        var completeResult = transaction.Complete();
        if (completeResult.IsFailure)
            return Result<DepositResponse>.Failure(completeResult.Error);

        _transactionRepository.Update(transaction);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        return Result<DepositResponse>.Success(MapToResponse(transaction));
    }

    private static DepositResponse MapToResponse(Domain.Entities.Transaction transaction)
    {
        return new DepositResponse(
            transaction.Id.Value,
            transaction.Type.ToString().ToLowerInvariant(),
            transaction.Status.ToString().ToLowerInvariant(),
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId.Value,
            transaction.Description,
            transaction.IdempotencyKey,
            transaction.CreatedAt,
            transaction.CompletedAt);
    }
}
