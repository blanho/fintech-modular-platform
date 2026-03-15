using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Transaction.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Transaction.Application.Queries.GetTransactionById;

public sealed class GetTransactionByIdQueryHandler
    : IRequestHandler<GetTransactionByIdQuery, Result<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionByIdQueryHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<TransactionDto>> Handle(
        GetTransactionByIdQuery request,
        CancellationToken cancellationToken)
    {
        var transactionId = new TransactionId(request.TransactionId);
        var transaction = await _transactionRepository.GetByIdAsync(transactionId, cancellationToken);

        if (transaction == null)
            return Result<TransactionDto>.Failure(Error.NotFound("Transaction"));

        return Result<TransactionDto>.Success(new TransactionDto(
            transaction.Id.Value,
            transaction.Type.ToString().ToLowerInvariant(),
            transaction.Status.ToString().ToLowerInvariant(),
            transaction.Amount.Amount,
            transaction.Amount.Currency.Code,
            transaction.SourceWalletId.Value,
            transaction.TargetWalletId?.Value,
            transaction.Description,
            transaction.IdempotencyKey,
            transaction.FailureReason,
            transaction.CreatedAt,
            transaction.UpdatedAt,
            transaction.CompletedAt));
    }
}
