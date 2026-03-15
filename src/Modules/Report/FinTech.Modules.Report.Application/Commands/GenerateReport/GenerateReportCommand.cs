using FinTech.Modules.Report.Domain.Enums;
using MediatR;

namespace FinTech.Modules.Report.Application.Commands.GenerateReport;

public sealed record GenerateReportCommand(
    string Title,
    ReportType Type,
    Guid RequestedByUserId,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    string? Parameters = null) : IRequest<Guid>;
