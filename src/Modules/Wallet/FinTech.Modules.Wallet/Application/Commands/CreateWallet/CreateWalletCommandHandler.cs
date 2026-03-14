namespace FinTech.Modules.Wallet.Application.Commands.CreateWallet;

using FinTech.SharedKernel.Contracts;
using FinTech.SharedKernel.Primitives;
using FinTech.SharedKernel.Results;
using FinTech.SharedKernel.ValueObjects;
using FinTech.Modules.Wallet.Application.Interfaces;
using FinTech.Modules.Wallet.Domain.Entities;
using MediatR;

public sealed class CreateWalletCommandHandler
    : IRequestHandler<CreateWalletCommand, Result<CreateWalletResponse>>
{
    private readonly IWalletRepository _walletRepository;
    private readonly IIdentityService _identityService;

    public CreateWalletCommandHandler(
        IWalletRepository walletRepository,
        IIdentityService identityService)
    {
        _walletRepository = walletRepository;
        _identityService = identityService;
    }

    public async Task<Result<CreateWalletResponse>> Handle(
        CreateWalletCommand request,
        CancellationToken cancellationToken)
    {
        var userId = new UserId(request.UserId);

var userExistsResult = await _identityService.ValidateUserExistsAsync(userId, cancellationToken);
        if (userExistsResult.IsFailure)
            return Result<CreateWalletResponse>.Failure(userExistsResult.Error);

        if (!userExistsResult.Value)
            return Result<CreateWalletResponse>.Failure(Error.NotFound("User"));

var currencyResult = Currency.FromCode(request.Currency);
        if (currencyResult.IsFailure)
            return Result<CreateWalletResponse>.Failure(currencyResult.Error);

var walletResult = Wallet.Create(userId, currencyResult.Value!, request.Name);
        if (walletResult.IsFailure)
            return Result<CreateWalletResponse>.Failure(walletResult.Error);

        var wallet = walletResult.Value!;

await _walletRepository.AddAsync(wallet, cancellationToken);
        await _walletRepository.SaveChangesAsync(cancellationToken);

        return Result<CreateWalletResponse>.Success(new CreateWalletResponse(
            wallet.Id.Value,
            wallet.UserId.Value,
            wallet.Currency.Code,
            wallet.Name,
            wallet.Status.ToString().ToLowerInvariant(),
            wallet.CreatedAt));
    }
}