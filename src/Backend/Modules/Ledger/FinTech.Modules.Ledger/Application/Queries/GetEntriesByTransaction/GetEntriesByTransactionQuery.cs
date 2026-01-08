namespace FinTech.Modules.Ledger.Application.Queries.GetEntriesByTransaction;

using FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using MediatR;

public sealed record GetEntriesByTransactionQuery(
    TransactionId TransactionId) : IRequest<Result<IEnumerable<LedgerEntryDto>>>;