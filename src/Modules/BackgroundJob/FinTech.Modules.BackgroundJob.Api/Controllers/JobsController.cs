using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Infrastructure.Extensions;
using FinTech.Modules.BackgroundJob.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.BackgroundJob.Api.Controllers;

[ApiController]
[Route("api/v1/jobs")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IBackgroundJobService _jobService;

    public JobsController(IMediator mediator, IBackgroundJobService jobService)
    {
        _mediator = mediator;
        _jobService = jobService;
    }

    [HttpGet("{jobId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStatus(Guid jobId, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetJobStatusQuery(jobId), ct);
        return result.ToActionResult();
    }

    [HttpPost("{jobId:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel(Guid jobId, CancellationToken ct)
    {
        await _jobService.RequestCancellationAsync(jobId, ct);
        return Ok(new { message = "Cancellation requested" });
    }
}
