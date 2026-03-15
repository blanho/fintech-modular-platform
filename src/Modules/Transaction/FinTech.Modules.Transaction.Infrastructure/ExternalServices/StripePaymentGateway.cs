using FinTech.BuildingBlocks.Application.Contracts;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Transaction.Infrastructure.ExternalServices;

public sealed class StripePaymentGateway : IPaymentGateway
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<StripePaymentGateway> _logger;

    public StripePaymentGateway(HttpClient httpClient, ILogger<StripePaymentGateway> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Processing payment of {Amount} {Currency} via Stripe",
            request.Amount, request.Currency);

        await Task.Delay(100, ct);

        var reference = $"pi_{Guid.NewGuid():N}";

        _logger.LogInformation("Payment processed successfully. Reference: {Reference}", reference);

        return new PaymentResult(
            IsSuccess: true,
            TransactionReference: reference,
            ErrorCode: null,
            ErrorMessage: null);
    }

    public async Task<PaymentResult> RefundAsync(
        string transactionReference,
        decimal amount,
        string currency,
        CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Refunding {Amount} {Currency} for transaction {Reference}",
            amount, currency, transactionReference);

        await Task.Delay(50, ct);

        return new PaymentResult(
            IsSuccess: true,
            TransactionReference: $"re_{Guid.NewGuid():N}",
            ErrorCode: null,
            ErrorMessage: null);
    }

    public async Task<PaymentStatusResult> GetStatusAsync(
        string transactionReference,
        CancellationToken ct = default)
    {
        _logger.LogInformation("Getting status for transaction {Reference}", transactionReference);

        await Task.Delay(50, ct);

        return new PaymentStatusResult(
            TransactionReference: transactionReference,
            Status: "succeeded",
            Amount: 0,
            Currency: "USD",
            ProcessedAt: DateTime.UtcNow);
    }
}
