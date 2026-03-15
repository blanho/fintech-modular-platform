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

    public WebhooksController(
        IWebhookVerifier webhookVerifier,
        IConfiguration configuration,
        ILogger<WebhooksController> logger)
    {
        _webhookVerifier = webhookVerifier;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("payment")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> HandlePaymentWebhook(CancellationToken ct)
    {
        using var reader = new StreamReader(Request.Body);
        var payload = await reader.ReadToEndAsync(ct);

        var signature = Request.Headers["X-Webhook-Signature"].FirstOrDefault();
        if (string.IsNullOrEmpty(signature))
        {
            _logger.LogWarning("Webhook received without signature");
            return Unauthorized(new { error = "Missing webhook signature" });
        }

        var secret = _configuration["Webhooks:PaymentSecret"]
                     ?? throw new InvalidOperationException("Webhook secret is not configured");

        if (!_webhookVerifier.Verify(payload, signature, secret))
        {
            _logger.LogWarning("Webhook signature verification failed");
            return Unauthorized(new { error = "Invalid webhook signature" });
        }

        _logger.LogInformation("Payment webhook received and verified. Payload length: {Length}", payload.Length);

        return Ok(new { received = true });
    }
}
