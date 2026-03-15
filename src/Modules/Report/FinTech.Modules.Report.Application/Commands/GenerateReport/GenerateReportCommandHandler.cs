using FinTech.Modules.Report.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Report.Application.Commands.GenerateReport;

internal sealed class GenerateReportCommandHandler : IRequestHandler<GenerateReportCommand, Guid>
{
    private readonly IReportRepository _reportRepository;

    public GenerateReportCommandHandler(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<Guid> Handle(GenerateReportCommand request, CancellationToken cancellationToken)
    {
        var report = Domain.Entities.Report.Create(
            request.Title,
            request.Type,
            request.RequestedByUserId,
            request.PeriodStart,
            request.PeriodEnd,
            request.Parameters);

        await _reportRepository.AddAsync(report, cancellationToken);
        await _reportRepository.SaveChangesAsync(cancellationToken);

        return report.Id;
    }
}
