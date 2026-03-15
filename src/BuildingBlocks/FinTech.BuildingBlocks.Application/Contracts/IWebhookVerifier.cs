namespace FinTech.BuildingBlocks.Application.Contracts;

public interface IWebhookVerifier
{
    bool Verify(string payload, string signature, string secret);
}
