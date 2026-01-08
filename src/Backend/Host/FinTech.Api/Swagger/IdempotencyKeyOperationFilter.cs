namespace FinTech.Api.Swagger;

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class IdempotencyKeyOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {

        var httpMethod = context.ApiDescription.HttpMethod?.ToUpperInvariant();

        if (httpMethod is "POST" or "PUT" or "PATCH" or "DELETE")
        {
            operation.Parameters ??= new List<OpenApiParameter>();

            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "Idempotency-Key",
                In = ParameterLocation.Header,
                Required = false,
                Description = "A unique key to ensure idempotent operations. If not provided, one will be generated automatically.",
                Schema = new OpenApiSchema
                {
                    Type = "string",
                    MaxLength = 100
                },
                Example = new Microsoft.OpenApi.Any.OpenApiString("txn_" + Guid.NewGuid().ToString("N")[..16])
            });
        }
    }
}