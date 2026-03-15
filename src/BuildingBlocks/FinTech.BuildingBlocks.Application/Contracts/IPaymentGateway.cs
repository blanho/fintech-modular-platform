namespace FinTech.BuildingBlocks.Application.Contracts;

public interface IPaymentGateway
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request, CancellationToken ct = default);
    Task<PaymentResult> RefundAsync(string transactionReference, decimal amount, string currency, CancellationToken ct = default);
    Task<PaymentStatusResult> GetStatusAsync(string transactionReference, CancellationToken ct = default);
}

public sealed record PaymentRequest(
    decimal Amount,
    string Currency,
    string Description,
    string IdempotencyKey,
    Dictionary<string, string>? Metadata = null);

public sealed record PaymentResult(
    bool IsSuccess,
    string? TransactionReference,
    string? ErrorCode,
    string? ErrorMessage);

public sealed record PaymentStatusResult(
    string TransactionReference,
    string Status,
    decimal Amount,
    string Currency,
    DateTime ProcessedAt);
