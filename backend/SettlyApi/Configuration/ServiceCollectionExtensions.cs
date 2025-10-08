namespace SettlyApi.Configuration;

public static class CorsConfig
{
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.WithOrigins("http://localhost:5173")  // should be changed in production environment 
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();  // request with cookies
            });
        });

        return services;
    }
}
