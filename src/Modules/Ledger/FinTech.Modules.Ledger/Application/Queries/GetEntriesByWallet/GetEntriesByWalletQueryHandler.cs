namespace FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;

using FinTech.Modules.Ledger.Application.Interfaces;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed class GetEntriesByWalletQueryHandler
    : IRequestHandler<GetEntriesByWalletQuery, Result<EntriesResponse>>
{
    private readonly ILedgerRepository _repository;

    public GetEntriesByWalletQueryHandler(ILedgerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<EntriesResponse>> Handle(
        GetEntriesByWalletQuery request,
        CancellationToken ct)
    {
        var (entries, totalCount) = await _repository.GetByWalletIdAsync(
            request.WalletId,
            request.Page,
            request.PageSize,
            ct);

        var entryDtos = entries.Select(e => new LedgerEntryDto(
            e.Id.Value,
            e.WalletId.Value,
            e.Amount,
            e.Currency,
            e.EntryType,
            e.ReferenceId.Value,
            e.Description,
            e.CreatedAt));

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        return Result<EntriesResponse>.Success(new EntriesResponse(
            entryDtos,
            request.Page,
            request.PageSize,
            totalCount,
            totalPages));
    }
}