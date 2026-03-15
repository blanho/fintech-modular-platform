using System.Text.Json;
using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.Modules.Report.Application.Interfaces;
using MediatR;

namespace FinTech.Modules.Report.Application.Commands.GenerateReport;

internal sealed class GenerateReportCommandHandler : IRequestHandler<GenerateReportCommand, Guid>
{
    private readonly IReportRepository _reportRepository;
    private readonly IBackgroundJobService _backgroundJobService;

    public GenerateReportCommandHandler(
        IReportRepository reportRepository,
        IBackgroundJobService backgroundJobService)
    {
        _reportRepository = reportRepository;
        _backgroundJobService = backgroundJobService;
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

        await _backgroundJobService.EnqueueAsync(
            "report-generation",
            JsonSerializer.Serialize(report.Id),
            cancellationToken);

        return report.Id;
    }
}
