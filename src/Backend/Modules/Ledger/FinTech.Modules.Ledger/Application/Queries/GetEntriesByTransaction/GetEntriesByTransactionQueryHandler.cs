namespace FinTech.Modules.Ledger.Application.Queries.GetEntriesByTransaction;

using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed class GetEntriesByTransactionQueryHandler
    : IRequestHandler<GetEntriesByTransactionQuery, Result<IEnumerable<LedgerEntryDto>>>
{
    private readonly ILedgerRepository _repository;

    public GetEntriesByTransactionQueryHandler(ILedgerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<LedgerEntryDto>>> Handle(
        GetEntriesByTransactionQuery request,
        CancellationToken ct)
    {
        var entries = await _repository.GetByReferenceIdAsync(request.TransactionId, ct);

        var entryDtos = entries.Select(e => new LedgerEntryDto(
            e.Id.Value,
            e.WalletId.Value,
            e.Amount,
            e.Currency,
            e.EntryType,
            e.ReferenceId.Value,
            e.Description,
            e.CreatedAt));

        return Result<IEnumerable<LedgerEntryDto>>.Success(entryDtos);
    }
}