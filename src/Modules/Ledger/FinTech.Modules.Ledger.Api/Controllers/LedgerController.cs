using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Infrastructure.Authorization;
using FinTech.BuildingBlocks.Infrastructure.Extensions;
using FinTech.Modules.Ledger.Application.Queries.GetBalance;
using FinTech.Modules.Ledger.Application.Queries.GetEntriesByTransaction;
using FinTech.Modules.Ledger.Application.Queries.GetEntriesByWallet;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Ledger.Api.Controllers;

[ApiController]
[Route("api/v1/ledger")]
[Authorize]
public class LedgerController : ControllerBase
{
    private readonly IMediator _mediator;

    public LedgerController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("entries")]
    [HasPermission("transactions:read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEntries(
        [FromQuery] Guid walletId,
        [FromQuery] Guid? referenceId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        if (referenceId.HasValue)
        {
            var transactionQuery = new GetEntriesByTransactionQuery(new TransactionId(referenceId.Value));
            var transactionResult = await _mediator.Send(transactionQuery, ct);
            return transactionResult.ToActionResult();
        }

        if (walletId == Guid.Empty)
            return BadRequest(new
            {
                success = false,
                error = new { code = "VALIDATION_ERROR", message = "walletId is required" }
            });

        var query = new GetEntriesByWalletQuery(new WalletId(walletId), page, pageSize);
        var result = await _mediator.Send(query, ct);

        return result.ToActionResult();
    }

    [HttpGet("balance/{walletId:guid}")]
    [HasPermission("wallets:read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetBalance(
        Guid walletId,
        CancellationToken ct)
    {
        var query = new GetBalanceQuery(new WalletId(walletId));
        var result = await _mediator.Send(query, ct);

        return result.ToActionResult();
    }
}
