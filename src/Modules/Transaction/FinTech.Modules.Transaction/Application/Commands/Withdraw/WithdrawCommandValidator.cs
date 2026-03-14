namespace FinTech.Modules.Transaction.Application.Commands.Withdraw;

using FluentValidation;

public sealed class WithdrawCommandValidator : AbstractValidator<WithdrawCommand>
{
    public WithdrawCommandValidator()
    {
        RuleFor(x => x.WalletId)
            .NotEmpty().WithMessage("Wallet is required");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be positive")
            .PrecisionScale(18, 4, false).WithMessage("Amount must have at most 18 digits with 4 decimal places");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required")
            .Length(3).WithMessage("Currency must be a 3-letter ISO code");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.IdempotencyKey)
            .MaximumLength(100).WithMessage("Idempotency key must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.IdempotencyKey));
    }
}