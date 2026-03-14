using FluentValidation;

namespace FinTech.Modules.Wallet.Application.Commands.CreateWallet;

public sealed class CreateWalletCommandValidator : AbstractValidator<CreateWalletCommand>
{
    public CreateWalletCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Currency)
            .NotEmpty()
            .WithMessage("Currency is required")
            .Length(3)
            .WithMessage("Currency code must be 3 characters");

        RuleFor(x => x.Name)
            .MaximumLength(100)
            .WithMessage("Wallet name cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));
    }
}