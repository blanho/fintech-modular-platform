using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.Domain.ValueObjects;
using FinTech.Modules.Transaction.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Commands.Withdraw;

public sealed class WithdrawCommandHandler : IRequestHandler<WithdrawCommand, Result<WithdrawResponse>>
{
    private readonly ILedgerService _ledgerService;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWalletService _walletService;

    public WithdrawCommandHandler(
        ITransactionRepository transactionRepository,
        IWalletService walletService,
        ILedgerService ledgerService)
    {
        _transactionRepository = transactionRepository;
        _walletService = walletService;
        _ledgerService = ledgerService;
    }

    public async Task<Result<WithdrawResponse>> Handle(
        WithdrawCommand request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);

        if (!string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            var existingTransaction = await _transactionRepository.GetByIdempotencyKeyAsync(
                request.IdempotencyKey, cancellationToken);

            if (existingTransaction != null)
                return Result<WithdrawResponse>.Success(MapToResponse(existingTransaction));
        }

        var walletResult = await _walletService.GetWalletInfoAsync(walletId, cancellationToken);
        if (walletResult.IsFailure)
            return Result<WithdrawResponse>.Failure(Error.NotFound("Wallet"));

        var canTransact = await _walletService.CanTransactAsync(walletId, cancellationToken);
        if (canTransact.IsFailure)
            return Result<WithdrawResponse>.Failure(canTransact.Error);

        if (walletResult.Value!.Currency != request.Currency)
            return Result<WithdrawResponse>.Failure(
                Error.Validation(
                    $"Currency mismatch: wallet uses {walletResult.Value.Currency}, request uses {request.Currency}"));

        var moneyResult = Money.Create(request.Amount, request.Currency);
        if (moneyResult.IsFailure)
            return Result<WithdrawResponse>.Failure(moneyResult.Error);

        var transactionResult = Domain.Entities.Transaction.CreateWithdrawal(
            walletId,
            moneyResult.Value!,
            request.Description,
            request.IdempotencyKey);

        if (transactionResult.IsFailure)
            return Result<WithdrawResponse>.Failure(transactionResult.Error);

        var transaction = transactionResult.Value!;

        await _transactionRepository.AddAsync(transaction, cancellationToken);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        var hasSufficientBalance = await _ledgerService.HasSufficientBalanceAsync(
            walletId, moneyResult.Value!, cancellationToken);

        if (hasSufficientBalance.IsFailure || !hasSufficientBalance.Value)
        {
            transaction.Fail("Insufficient balance");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<WithdrawResponse>.Failure(Error.InsufficientBalance());
        }

        var debitResult = await _ledgerService.AppendDebitAsync(
            walletId,
            moneyResult.Value!,
            transaction.Id,
            request.Description ?? "Withdrawal",
            cancellationToken);

        if (debitResult.IsFailure)
        {
            transaction.Fail($"Failed to create debit entry: {debitResult.Error.Message}");
            _transactionRepository.Update(transaction);
            await _transactionRepository.SaveChangesAsync(cancellationToken);
            return Result<WithdrawResponse>.Failure(debitResult.Error);
        }

        var completeResult = transaction.Complete();
        if (completeResult.IsFailure)
            return Result<WithdrawResponse>.Failure(completeResult.Error);

        _transactionRepository.Update(transaction);
        await _transactionRepository.SaveChangesAsync(cancellationToken);

        return Result<WithdrawResponse>.Success(MapToResponse(transaction));
    }

    private static WithdrawResponse MapToResponse(Domain.Entities.Transaction transaction)
    {
        return new WithdrawResponse(
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