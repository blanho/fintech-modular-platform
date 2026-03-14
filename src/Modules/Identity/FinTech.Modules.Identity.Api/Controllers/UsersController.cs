using System.Security.Claims;
using FinTech.BuildingBlocks.Domain.Primitives;
using FinTech.BuildingBlocks.Infrastructure.Extensions;
using FinTech.Modules.Identity.Api.Requests;
using FinTech.Modules.Identity.Application.Queries.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Identity.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userIdGuid))
            return Unauthorized(new
            {
                success = false,
                error = new { code = "UNAUTHORIZED", message = "Invalid token" }
            });

        var userId = new UserId(userIdGuid);
        var query = new GetCurrentUserQuery(userId);

        var result = await _mediator.Send(query, ct);

        return result.ToActionResult();
    }

    [HttpPatch("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileRequest request,
        CancellationToken ct)
    {
        return Task.FromResult<IActionResult>(Ok(new
        {
            success = true,
            message = "Profile update endpoint - to be implemented"
        }));
    }

    [HttpPost("me/change-password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        CancellationToken ct)
    {
        return Task.FromResult<IActionResult>(NoContent());
    }
}