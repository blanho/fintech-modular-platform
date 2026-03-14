namespace FinTech.Modules.Identity.Application.Commands.Register;

using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string? FirstName,
    string? LastName
) : IRequest<Result<RegisterResponse>>;

public sealed record RegisterResponse(
    Guid UserId,
    string Email,
    string? FirstName,
    string? LastName,
    DateTime CreatedAt
);