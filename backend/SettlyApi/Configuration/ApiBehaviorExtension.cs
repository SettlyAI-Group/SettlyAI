using Microsoft.AspNetCore.Mvc;
using SettlyModels;

namespace SettlyApi.Configuration
{

    public static class ApiBehaviorExtension
    {
        /// <summary>
        /// Configures custom API response for model validation failures.
        /// Returns a consistent JSON with Code, Message, TraceId, and field Errors.
        /// </summary>

        public static IServiceCollection AddCustomApiBehavior(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    // Collect validation errors
                    var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                        );

                    var errorResponse = new ErrorResponse
                    {
                        Code = StatusCodes.Status400BadRequest,
                        Message = "Validation failed.",
                        TraceId = context.HttpContext.TraceIdentifier,
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });
            return services;
        }
    }
}
