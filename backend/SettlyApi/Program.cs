using Microsoft.EntityFrameworkCore;
using SettlyModels;

namespace SettlyApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var apiConfigs = builder.Configuration.GetSection("ApiConfigs").Get<ApiConfigs>();
        builder.Services.AddDbContext<SettlyDbContext>(
            options => options
                .UseNpgsql(apiConfigs?.DBConnection ?? throw new InvalidOperationException("Database connection string not found"))
                // The following three options help with debugging, but should
                // be changed or removed for production.
                .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
        );

        // Add services to the container.
        builder.Services.AddControllers();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseAuthorization();
        app.MapControllers();

        Console.WriteLine("Starting SettlyAI API server...");
        
        // Don't run the server during testing
        if (!builder.Environment.IsEnvironment("Test"))
        {
            app.Run();
        }
    }
}
