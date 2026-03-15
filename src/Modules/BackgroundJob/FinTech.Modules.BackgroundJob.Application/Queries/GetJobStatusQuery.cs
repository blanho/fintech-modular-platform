using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.BackgroundJob.Application.Queries;

public sealed record GetJobStatusQuery(Guid JobId) : IRequest<Result<BackgroundJobStatus>>;
