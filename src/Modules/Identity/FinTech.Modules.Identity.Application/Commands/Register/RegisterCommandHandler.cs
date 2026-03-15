using FinTech.BuildingBlocks.Domain.Results;
using FinTech.BuildingBlocks.EventBus;
using FinTech.BuildingBlocks.EventBus.Events;
using FinTech.Modules.Identity.Application.Interfaces;
using FinTech.Modules.Identity.Domain.Entities;
using FinTech.Modules.Identity.Domain.Enums;
using FinTech.Modules.Identity.Domain.ValueObjects;
using MediatR;
using Microsoft.Extensions.Logging;

namespace FinTech.Modules.Identity.Application.Commands.Register;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<RegisterResponse>>
{
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<RegisterCommandHandler> _logger;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRoleRepository _roleRepository;
    private readonly IUserRepository _userRepository;

    public RegisterCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IEventPublisher eventPublisher,
        IRoleRepository roleRepository,
        ILogger<RegisterCommandHandler> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _eventPublisher = eventPublisher;
        _roleRepository = roleRepository;
        _logger = logger;
    }

    public async Task<Result<RegisterResponse>> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        if (await _userRepository.EmailExistsAsync(request.Email, cancellationToken))
            return Result<RegisterResponse>.Failure(Error.Conflict("Email already registered"));

        var emailResult = Email.Create(request.Email);
        if (emailResult.IsFailure)
            return Result<RegisterResponse>.Failure(emailResult.Error);

        var hashedPassword = _passwordHasher.Hash(request.Password);
        var passwordHash = PasswordHash.Create(hashedPassword);

        var userResult = User.Create(
            emailResult.Value!,
            passwordHash,
            request.FirstName,
            request.LastName);

        if (userResult.IsFailure)
            return Result<RegisterResponse>.Failure(userResult.Error);

        var user = userResult.Value!;

        await _userRepository.AddAsync(user, cancellationToken);

        var defaultRole = await _roleRepository.GetByTypeAsync(RoleType.User, cancellationToken);
        if (defaultRole is not null)
        {
            var userRole = UserRole.Create(user.Id, defaultRole.Id, null);
            await _roleRepository.AddUserRoleAsync(userRole, cancellationToken);
            _logger.LogInformation("Assigned default User role to user {UserId}", user.Id);
        }

        await _userRepository.SaveChangesAsync(cancellationToken);

        try
        {
            var integrationEvent = new UserCreatedIntegrationEvent(
                user.Id.Value,
                user.Email.Value,
                user.FirstName,
                user.LastName);

            await _eventPublisher.PublishAsync(integrationEvent, cancellationToken);

            _logger.LogInformation(
                "Published UserCreatedIntegrationEvent for user {UserId}",
                user.Id);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Failed to publish integration event for user {UserId}",
                user.Id);
        }

        return Result<RegisterResponse>.Success(new RegisterResponse(
            user.Id.Value,
            user.Email.Value,
            user.FirstName,
            user.LastName,
            user.CreatedAt
        ));
    }
}
