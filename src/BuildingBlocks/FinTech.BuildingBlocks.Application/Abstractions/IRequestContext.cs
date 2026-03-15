namespace FinTech.BuildingBlocks.Application.Abstractions;

public interface IRequestContext
{
    Guid? UserId { get; }
    string? IpAddress { get; }
    string? UserAgent { get; }
    string? CorrelationId { get; }
}
