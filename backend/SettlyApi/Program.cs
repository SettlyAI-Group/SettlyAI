using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyApi.Configuration;
using SettlyService;


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
        //Register ISearchApi with SearchApiService
        builder.Services.AddScoped<ISettlyService.ISearchService, SettlyService.SearchService>();
        // Add services to the container.
        builder.Services.AddControllers();
        // Add AutoMapper - scan all assemblies for profiles
        builder.Services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddScoped<ISuburbService, SuburbService>();
        builder.Services.AddScoped<IPropertyService, PropertyService>();
        builder.Services.AddScoped<IFavouriteService, FavouriteService>();
        builder.Services.AddTransient<IPopulationSupplyService, PopulationSupplyService>();
        builder.Services.AddScoped<ITestimonialService, TestimonialService>();


        //Add Swagger
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("SettlyService", new Microsoft.OpenApi.Models.OpenApiInfo()
            {
                Title = "SettlyAI",
                Version = "1.0.0.0",
                Description = "SettlyAI Web Api",
                Contact = new Microsoft.OpenApi.Models.OpenApiContact()
            });
            options.EnableAnnotations();
        });
        var app = builder.Build();
        // use Swagger
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(option =>
            {
                option.SwaggerEndpoint($"/swagger/SettlyService/swagger.json", "SettlyService");
            });
        }
        // Configure the HTTP request pipeline.
        app.UseRouting();
        app.UseCors("AllowAll");
        app.UseAuthorization();
        app.MapControllers();
        Console.WriteLine("Starting SettlyAI API server...");
        app.Run();
    }
}
