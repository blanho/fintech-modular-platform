namespace FinTech.Modules.Transaction.Api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FinTech.Infrastructure.Extensions;
using FinTech.Modules.Transaction.Api.Requests;
using FinTech.Modules.Transaction.Application.Commands.Transfer;
using FinTech.Modules.Transaction.Application.Commands.Deposit;
using FinTech.Modules.Transaction.Application.Commands.Withdraw;
using FinTech.Modules.Transaction.Application.Queries.GetTransactionById;
using FinTech.Modules.Transaction.Application.Queries.GetTransactionsByWallet;

[ApiController]
[Route("api/v1/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

[HttpPost("transfer")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Transfer(
        [FromBody] TransferRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken cancellationToken)
    {
        if (!decimal.TryParse(request.Amount, out var amount))
        {
            return BadRequest(new { success = false, error = new { code = "VALIDATION_ERROR", message = "Invalid amount format" } });
        }

        var command = new TransferCommand(
            request.SourceWalletId,
            request.TargetWalletId,
            amount,
            request.Currency,
            request.Description,
            idempotencyKey);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return result.ToCreatedResult($"/api/v1/transactions/{result.Value!.TransactionId}");
    }

[HttpPost("deposit")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Deposit(
        [FromBody] DepositRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken cancellationToken)
    {
        if (!decimal.TryParse(request.Amount, out var amount))
        {
            return BadRequest(new { success = false, error = new { code = "VALIDATION_ERROR", message = "Invalid amount format" } });
        }

        var command = new DepositCommand(
            request.WalletId,
            amount,
            request.Currency,
            request.Description,
            idempotencyKey);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return result.ToCreatedResult($"/api/v1/transactions/{result.Value!.TransactionId}");
    }

[HttpPost("withdraw")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Withdraw(
        [FromBody] WithdrawRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken cancellationToken)
    {
        if (!decimal.TryParse(request.Amount, out var amount))
        {
            return BadRequest(new { success = false, error = new { code = "VALIDATION_ERROR", message = "Invalid amount format" } });
        }

        var command = new WithdrawCommand(
            request.WalletId,
            amount,
            request.Currency,
            request.Description,
            idempotencyKey);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return result.ToCreatedResult($"/api/v1/transactions/{result.Value!.TransactionId}");
    }

[HttpGet("{transactionId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        Guid transactionId,
        CancellationToken cancellationToken)
    {
        var query = new GetTransactionByIdQuery(transactionId);
        var result = await _mediator.Send(query, cancellationToken);

        return result.ToActionResult();
    }

[HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByWallet(
        [FromQuery] Guid walletId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? type = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        if (walletId == Guid.Empty)
        {
            return BadRequest(new { success = false, error = new { code = "VALIDATION_ERROR", message = "Wallet ID is required" } });
        }

        var query = new GetTransactionsByWalletQuery(
            walletId,
            page,
            pageSize,
            type,
            status,
            fromDate,
            toDate);

        var result = await _mediator.Send(query, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        var response = result.Value!;
        return Ok(new
        {
            success = true,
            data = response.Transactions,
            pagination = new
            {
                page = response.Page,
                pageSize = response.PageSize,
                totalItems = response.TotalItems,
                totalPages = response.TotalPages,
                hasNext = response.HasNext,
                hasPrevious = response.HasPrevious
            }
        });
    }
}