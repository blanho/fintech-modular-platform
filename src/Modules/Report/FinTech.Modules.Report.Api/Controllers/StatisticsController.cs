using FinTech.Modules.Report.Application.Queries.GetDashboardStatistics;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Report.Api.Controllers;

[ApiController]
[Route("api/v1/statistics")]
[Authorize]
public sealed class StatisticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StatisticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(DashboardStatisticsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardStatistics(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDashboardStatisticsQuery(), cancellationToken);
        return Ok(result);
    }
}
