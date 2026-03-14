namespace FinTech.Modules.Transaction.Application.Queries.GetTransactionsByWallet;

using MediatR;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using FinTech.Modules.Transaction.Application.Interfaces;
using FinTech.Modules.Transaction.Application.Queries.GetTransactionById;
using FinTech.Modules.Transaction.Domain.Enums;

public sealed class GetTransactionsByWalletQueryHandler
    : IRequestHandler<GetTransactionsByWalletQuery, Result<GetTransactionsByWalletResponse>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionsByWalletQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<GetTransactionsByWalletResponse>> Handle(
        GetTransactionsByWalletQuery request,
        CancellationToken cancellationToken)
    {
        var walletId = new WalletId(request.WalletId);

TransactionType? typeFilter = null;
        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            if (Enum.TryParse<TransactionType>(request.Type, true, out var parsedType))
                typeFilter = parsedType;
        }

        TransactionStatus? statusFilter = null;
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (Enum.TryParse<TransactionStatus>(request.Status, true, out var parsedStatus))
                statusFilter = parsedStatus;
        }

var transactions = await _transactionRepository.GetByWalletIdAsync(
            walletId,
            request.Page,
            request.PageSize,
            typeFilter,
            statusFilter,
            request.FromDate,
            request.ToDate,
            cancellationToken);

var totalItems = await _transactionRepository.GetCountByWalletIdAsync(
            walletId,
            typeFilter,
            statusFilter,
            request.FromDate,
            request.ToDate,
            cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

        var transactionDtos = transactions.Select(t => new TransactionDto(
            t.Id.Value,
            t.Type.ToString().ToLowerInvariant(),
            t.Status.ToString().ToLowerInvariant(),
            t.Amount.Amount,
            t.Amount.Currency.Code,
            t.SourceWalletId.Value,
            t.TargetWalletId?.Value,
            t.Description,
            t.IdempotencyKey,
            t.FailureReason,
            t.CreatedAt,
            t.UpdatedAt,
            t.CompletedAt)).ToList();

        return Result<GetTransactionsByWalletResponse>.Success(
            new GetTransactionsByWalletResponse(
                transactionDtos,
                request.Page,
                request.PageSize,
                totalItems,
                totalPages,
                request.Page < totalPages,
                request.Page > 1));
    }
}