using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Domain.Results;
using FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;
using MediatR;

namespace FinTech.Modules.Ledger.Application.Queries.GetEntriesByTransaction;

public sealed record GetEntriesByTransactionQuery(
    TransactionId TransactionId) : IRequest<Result<IEnumerable<LedgerEntryDto>>>;
