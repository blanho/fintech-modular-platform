using FinTech.BuildingBlocks.Infrastructure.Authorization;
using FinTech.Modules.Report.Application.Commands.GenerateReport;
using FinTech.Modules.Report.Application.Queries.ExportReport;
using FinTech.Modules.Report.Application.Queries.GetReport;
using FinTech.Modules.Report.Application.Queries.GetUserReports;
using FinTech.Modules.Report.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.Modules.Report.Api.Controllers;

[ApiController]
[Route("api/v1/reports")]
[Authorize]
public sealed class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [HasPermission("reports:read")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateReport(
        [FromBody] GenerateReportRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var command = new GenerateReportCommand(
            request.Title,
            request.Type,
            userId,
            request.PeriodStart,
            request.PeriodEnd,
            request.Parameters);

        var reportId = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetReport),
            new { id = reportId },
            new { id = reportId });
    }

    [HttpGet("{id:guid}")]
    [HasPermission("reports:read")]
    [ProducesResponseType(typeof(ReportDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetReport(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetReportQuery(id), cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("my")]
    [HasPermission("reports:read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyReports(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        var query = new GetUserReportsQuery(userId, page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}/export")]
    [HasPermission("reports:export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportReport(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new ExportReportQuery(id), cancellationToken);
        if (result is null)
            return NotFound();

        return File(result.Content, result.ContentType, result.FileName);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}

public sealed record GenerateReportRequest(
    string Title,
    ReportType Type,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    string? Parameters = null);
