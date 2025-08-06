using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SettlyModels;
using SettlyApi.Configuration;
using SettlyService;
using SettlyService.Mapping;

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

        // Add CORS services
        builder.Services.AddCorsPolicies();

        // Add application services
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IEmailSender, StubEmailSender>();
        builder.Services.AddScoped<IVerificationCodeService, VerificationCodeService>();
        builder.Services.AddScoped<IAuthService, AuthService>();


        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddScoped<ISuburbReportService, SuburbReportService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseCors("AllowAll");
        app.UseAuthorization();
        app.MapControllers();

        Console.WriteLine("Starting SettlyAI API server...");
        app.Run();
    }
}
