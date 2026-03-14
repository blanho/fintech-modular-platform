namespace FinTech.Modules.Identity.Api.Requests;

public sealed record RegisterRequest(
    string Email,
    string Password,
    string? FirstName,
    string? LastName);