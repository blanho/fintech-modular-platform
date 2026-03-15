namespace FinTech.Modules.Identity.Api.Requests;

public sealed record LogoutRequest(
    string? RefreshToken);
