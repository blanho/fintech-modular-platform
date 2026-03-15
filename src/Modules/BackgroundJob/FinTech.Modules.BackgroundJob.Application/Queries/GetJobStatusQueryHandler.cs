using FinTech.BuildingBlocks.Application.Contracts;
using FinTech.BuildingBlocks.Domain.Results;
using MediatR;

namespace FinTech.Modules.BackgroundJob.Application.Queries;

public sealed class GetJobStatusQueryHandler : IRequestHandler<GetJobStatusQuery, Result<BackgroundJobStatus>>
{
    private readonly IBackgroundJobService _jobService;

    public GetJobStatusQueryHandler(IBackgroundJobService jobService)
    {
        _jobService = jobService;
    }

    public async Task<Result<BackgroundJobStatus>> Handle(
        GetJobStatusQuery request,
        CancellationToken cancellationToken)
    {
        var status = await _jobService.GetStatusAsync(request.JobId, cancellationToken);

        return status is null
            ? Result<BackgroundJobStatus>.Failure(Error.NotFound("Job not found"))
            : Result<BackgroundJobStatus>.Success(status);
    }
}
