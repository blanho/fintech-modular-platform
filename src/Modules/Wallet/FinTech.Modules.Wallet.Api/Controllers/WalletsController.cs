using System.Security.Claims;
using FinTech.BuildingBlocks.Infrastructure.Extensions;
using FinTech.Modules.Wallet.Api.Requests;
using FinTech.Modules.Wallet.Application.Commands.CloseWallet;
using FinTech.Modules.Wallet.Application.Commands.CreateWallet;
using FinTech.Modules.Wallet.Application.Commands.FreezeWallet;
using FinTech.Modules.Wallet.Application.Commands.RenameWallet;
using FinTech.Modules.Wallet.Application.Commands.UnfreezeWallet;
using FinTech.Modules.Wallet.Application.Queries.GetWalletBalance;
using FinTech.Modules.Wallet.Application.Queries.GetWalletById;
using FinTech.Modules.Wallet.Application.Queries.GetWalletsByUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Wallet.Api.Controllers;

[ApiController]
[Route("api/v1/wallets")]
[Authorize]
public sealed class WalletsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WalletsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateWallet(
        [FromBody] CreateWalletRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var command = new CreateWalletCommand(userId, request.Currency, request.Name);
        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return result.ToCreatedResult($"api/v1/wallets/{result.Value!.WalletId}");
    }

    [HttpGet("{walletId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetWallet(
        Guid walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var query = new GetWalletByIdQuery(walletId, userId);
        var result = await _mediator.Send(query, cancellationToken);

        return result.ToActionResult();
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetWallets(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();

        var query = new GetWalletsByUserQuery(userId, page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        var response = result.Value!;
        return Ok(new
        {
            success = true,
            data = response.Wallets,
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

    [HttpGet("{walletId:guid}/balance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetWalletBalance(
        Guid walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var query = new GetWalletBalanceQuery(walletId, userId);
        var result = await _mediator.Send(query, cancellationToken);

        return result.ToActionResult();
    }

    [HttpPatch("{walletId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RenameWallet(
        Guid walletId,
        [FromBody] RenameWalletRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var command = new RenameWalletCommand(walletId, userId, request.Name);
        var result = await _mediator.Send(command, cancellationToken);

        return result.ToActionResult();
    }

    [HttpPost("{walletId:guid}/freeze")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> FreezeWallet(
        Guid walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var command = new FreezeWalletCommand(walletId, userId);
        var result = await _mediator.Send(command, cancellationToken);

        return result.ToActionResult();
    }

    [HttpPost("{walletId:guid}/unfreeze")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UnfreezeWallet(
        Guid walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var command = new UnfreezeWalletCommand(walletId, userId);
        var result = await _mediator.Send(command, cancellationToken);

        return result.ToActionResult();
    }

    [HttpPost("{walletId:guid}/close")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> CloseWallet(
        Guid walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var command = new CloseWalletCommand(walletId, userId);
        var result = await _mediator.Send(command, cancellationToken);

        return result.ToActionResult();
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Invalid user ID in token");

        return userId;
    }
}