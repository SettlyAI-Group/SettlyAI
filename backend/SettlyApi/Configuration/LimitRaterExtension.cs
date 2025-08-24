using System.Threading.RateLimiting;

namespace SettlyApi.Configuration
{
    public static class LimitRaterExtension
    {
        public static void AddLoginLimitRater(this IServiceCollection services, int attempts, int miniutes)
        {
            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.AddPolicy("LoginIpFixedWindow", httpContext =>
                {
                    var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ip,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = attempts,                       // <= 5 attempts ...
                            Window = TimeSpan.FromMinutes(miniutes),     // ... every 15 minutes
                            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                            QueueLimit = 0                         // don't queue, just reject
                        });
                });
            });
        }
    }
}
