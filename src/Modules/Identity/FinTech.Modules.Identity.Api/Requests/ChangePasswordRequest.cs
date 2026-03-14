namespace FinTech.Modules.Identity.Api.Requests;

public sealed record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);