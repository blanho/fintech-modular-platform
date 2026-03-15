using System.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http;
using Polly;
using Polly.Extensions.Http;

namespace FinTech.BuildingBlocks.Infrastructure.Resilience;

public static class ResiliencePolicies
{
    public static IHttpClientBuilder AddStandardResilience(
        this IHttpClientBuilder builder,
        string serviceName)
    {
        builder.AddPolicyHandler(GetRetryPolicy(serviceName));
        builder.AddPolicyHandler(GetCircuitBreakerPolicy(serviceName));
        builder.AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(10)));

        return builder;
    }

    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy(string serviceName)
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => msg.StatusCode == HttpStatusCode.TooManyRequests)
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt =>
                    TimeSpan.FromMilliseconds(500 * Math.Pow(2, retryAttempt))
                    + TimeSpan.FromMilliseconds(Random.Shared.Next(0, 100)),
                onRetry: (outcome, timespan, retryAttempt, _) =>
                {
                });
    }

    private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy(string serviceName)
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(
                handledEventsAllowedBeforeBreaking: 5,
                durationOfBreak: TimeSpan.FromSeconds(30));
    }
}
