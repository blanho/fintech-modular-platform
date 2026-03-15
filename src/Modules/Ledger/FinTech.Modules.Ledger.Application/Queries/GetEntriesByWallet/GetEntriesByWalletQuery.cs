using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Ledger.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;

public sealed record GetEntriesByWalletQuery(
    WalletId WalletId,
    int Page = 1,
    int PageSize = 50) : IRequest<Result<EntriesResponse>>;

public sealed record EntriesResponse(
    IEnumerable<LedgerEntryDto> Entries,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages);

public sealed record LedgerEntryDto(
    Guid EntryId,
    Guid WalletId,
    decimal Amount,
    string Currency,
    LedgerEntryType EntryType,
    Guid ReferenceId,
    string? Description,
    DateTime CreatedAt);
