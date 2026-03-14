using System.Security.Claims;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Infrastructure.Extensions;
using FinTech.Modules.Notification.Api.Requests;
using FinTech.Modules.Notification.Application.Commands.UpdatePreferences;
using FinTech.Modules.Notification.Application.Queries.GetNotifications;
using FinTech.Modules.Notification.Application.Queries.GetPreferences;
using FinTech.Modules.Notification.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Notification.Api.Controllers;

[ApiController]
[Route("api/v1/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("preferences")]
    public async Task<IActionResult> GetPreferences(CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var query = new GetPreferencesQuery(userId.Value);
        var result = await _mediator.Send(query, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return Ok(new { success = true, data = result.Value });
    }

    [HttpPut("preferences")]
    public async Task<IActionResult> UpdatePreferences(
        [FromBody] UpdatePreferencesRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var command = new UpdatePreferencesCommand(
            userId.Value,
            request.EmailEnabled,
            request.PushEnabled,
            request.SmsEnabled,
            request.TransactionAlerts,
            request.SecurityAlerts,
            request.MarketingEnabled);

        var result = await _mediator.Send(command, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return Ok(new { success = true, data = result.Value });
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] string? status = null,
        [FromQuery] string? category = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        NotificationStatus? statusFilter = null;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<NotificationStatus>(status, true, out var s))
            statusFilter = s;

        NotificationCategory? categoryFilter = null;
        if (!string.IsNullOrEmpty(category) && Enum.TryParse<NotificationCategory>(category, true, out var c))
            categoryFilter = c;

        var query = new GetNotificationsQuery(
            userId.Value,
            statusFilter,
            categoryFilter,
            page,
            pageSize);

        var result = await _mediator.Send(query, cancellationToken);

        if (result.IsFailure)
            return result.ToActionResult();

        return Ok(new
        {
            success = true,
            data = result.Value!.Notifications,
            pagination = new
            {
                page = result.Value.Page,
                pageSize = result.Value.PageSize,
                totalItems = result.Value.TotalCount,
                totalPages = result.Value.TotalPages,
                hasNext = result.Value.Page < result.Value.TotalPages,
                hasPrevious = result.Value.Page > 1
            }
        });
    }

    private UserId? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return null;

        return new UserId(userId);
    }
}