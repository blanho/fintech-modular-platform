using FluentValidation;

namespace FinTech.Modules.Report.Application.Commands.GenerateReport;

public sealed class GenerateReportCommandValidator : AbstractValidator<GenerateReportCommand>
{
    public GenerateReportCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Type)
            .IsInEnum();

        RuleFor(x => x.RequestedByUserId)
            .NotEmpty();

        RuleFor(x => x.PeriodStart)
            .LessThan(x => x.PeriodEnd)
            .WithMessage("Period start must be before period end.");

        RuleFor(x => x.PeriodEnd)
            .LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("Period end cannot be in the future.");
    }
}
