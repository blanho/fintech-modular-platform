using System.Diagnostics;
using FinTech.BuildingBlocks.Application.Abstractions;
using FinTech.BuildingBlocks.Application.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Transaction.Api.Controllers;

[ApiController]
[Route("api/v1/webhooks")]
public class WebhooksController : ControllerBase
{
    private readonly IWebhookVerifier _webhookVerifier;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WebhooksController> _logger;
    private readonly IAuditService _auditService;
    private readonly IRequestContext _requestContext;

    public WebhooksController(
        IWebhookVerifier webhookVerifier,
        IConfiguration configuration,
        ILogger<WebhooksController> logger,
        IAuditService auditService,
        IRequestContext requestContext)
    {
        _webhookVerifier = webhookVerifier;
        _configuration = configuration;
        _logger = logger;
        _auditService = auditService;
        _requestContext = requestContext;
    }

    [HttpPost("payment")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> HandlePaymentWebhook(CancellationToken ct)
    {
        var stopwatch = Stopwatch.StartNew();

        using var reader = new StreamReader(Request.Body);
        var payload = await reader.ReadToEndAsync(ct);

        var signature = Request.Headers["X-Webhook-Signature"].FirstOrDefault();
        if (string.IsNullOrEmpty(signature))
        {
            _logger.LogWarning("Webhook received without signature");

            stopwatch.Stop();
            await _auditService.RecordAsync(new AuditEntry(
                null,
                "WebhookReceived",
                "PaymentWebhook",
                null,
                false,
                "Missing webhook signature",
                stopwatch.ElapsedMilliseconds,
                _requestContext.IpAddress,
                _requestContext.UserAgent,
                _requestContext.CorrelationId), ct);

            return Unauthorized(new { error = "Missing webhook signature" });
        }

        var secret = _configuration["Webhooks:PaymentSecret"]
                     ?? throw new InvalidOperationException("Webhook secret is not configured");

        if (!_webhookVerifier.Verify(payload, signature, secret))
        {
            _logger.LogWarning("Webhook signature verification failed");

            stopwatch.Stop();
            await _auditService.RecordAsync(new AuditEntry(
                null,
                "WebhookReceived",
                "PaymentWebhook",
                null,
                false,
                "Invalid webhook signature",
                stopwatch.ElapsedMilliseconds,
                _requestContext.IpAddress,
                _requestContext.UserAgent,
                _requestContext.CorrelationId), ct);

            return Unauthorized(new { error = "Invalid webhook signature" });
        }

        _logger.LogInformation("Payment webhook received and verified. Payload length: {Length}", payload.Length);

        stopwatch.Stop();
        await _auditService.RecordAsync(new AuditEntry(
            null,
            "WebhookReceived",
            "PaymentWebhook",
            null,
            true,
            null,
            stopwatch.ElapsedMilliseconds,
            _requestContext.IpAddress,
            _requestContext.UserAgent,
            _requestContext.CorrelationId), ct);

        return Ok(new { received = true });
    }
}
