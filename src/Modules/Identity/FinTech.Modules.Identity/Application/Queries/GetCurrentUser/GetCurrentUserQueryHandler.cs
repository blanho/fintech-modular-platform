namespace FinTech.Modules.Identity.Application.Queries.GetCurrentUser;

using FinTech.SharedKernel.Results;
using FinTech.Modules.Identity.Application.Interfaces;
using MediatR;

public sealed class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, Result<CurrentUserResponse>>
{
    private readonly IUserRepository _userRepository;

    public GetCurrentUserQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<CurrentUserResponse>> Handle(
        GetCurrentUserQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
            return Result<CurrentUserResponse>.Failure(Error.NotFound("User"));

        return Result<CurrentUserResponse>.Success(new CurrentUserResponse(
            user.Id.Value,
            user.Email.Value,
            user.FirstName,
            user.LastName,
            user.Status.ToString().ToLowerInvariant(),
            user.CreatedAt,
            user.LastLoginAt
        ));
    }
}