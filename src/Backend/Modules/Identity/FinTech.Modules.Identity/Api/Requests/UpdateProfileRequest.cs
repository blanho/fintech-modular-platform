namespace FinTech.Modules.Identity.Api.Requests;

public sealed record UpdateProfileRequest(
    string? FirstName,
    string? LastName);