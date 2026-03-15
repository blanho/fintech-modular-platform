using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.Identity.Application.Commands.Logout;

public sealed record LogoutCommand(
    string AccessToken,
    string? RefreshToken
) : IRequest<Result>;
