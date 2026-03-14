namespace FinTech.Modules.Identity.Api.Requests;

public sealed record LoginRequest(
    string Email,
    string Password);