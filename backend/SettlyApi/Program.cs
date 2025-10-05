using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SettlyApi.Configuration;
using SettlyApi.Filters;
using SettlyApi.Middlewares;
using SettlyFinance.Calculators;
using SettlyFinance.Calculators.Orchestrators;
using SettlyFinance.Interfaces;
using SettlyModels;
using SettlyModels.OAutOptions;
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
        // EmailSettings
        builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
        // OAuth
        builder.Services.Configure<OAuthOptions>(
            builder.Configuration.GetSection("OAuth"));
        // Add CORS services
        builder.Services.AddCorsPolicies();
        // Add application services
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IEmailService, MailKitEmailService>();
        builder.Services.AddScoped<IVerificationCodeService, VerificationCodeService>();
        builder.Services.AddTransient<ICreateTokenService, CreateTokenService>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<ISuburbOverviewService, SuburbOverviewService>();
        //Register ISearchApi with SearchApiService
        builder.Services.AddScoped<ISettlyService.ISearchService, SettlyService.SearchService>();

        // Add your custom API behavior config
        builder.Services.AddCustomApiBehavior();
        builder.Services.AddHttpClient();
        // Add services to the container.
        builder.Services.AddControllers();
        // Add AutoMapper - scan all assemblies for profiles
        builder.Services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddScoped<ISuburbService, SuburbService>();
        builder.Services.AddScoped<IPropertyService, PropertyService>();
        builder.Services.AddScoped<IFavouriteService, FavouriteService>();
        builder.Services.AddTransient<IPopulationSupplyService, PopulationSupplyService>();

        builder.Services.AddScoped<ILoanService, LoanService>();
        builder.Services.AddScoped<ITestimonialService, TestimonialService>();
        builder.Services.AddScoped<IPdfExportService, PdfService>();
        builder.Services.AddScoped<IOAuthService, OAuthService>();


        builder.Services.AddScoped<ILoanCalculatorFacade, LoanCalculatorFacade>();
        builder.Services.AddScoped<IPiecewiseAmortizer, PiecewiseAmortizer>();
        builder.Services.AddScoped<ILoanCalculatorService, LoanCalculatorService>();
        builder.Services.AddSingleton<IFrequencyProvider, FrequencyProvider>();
        builder.Services.AddSingleton<IAmortizationEngineFactory, AmortizationEngineFactory>();
        builder.Services.AddScoped<ILayoutNavService, LayoutNavService>();
        //Add Swagger
        builder.Services.AddSwaggerConfig();

        // JWT configration
        builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection(JWTConfig.Section));
        var jwtConfig = builder.Configuration.GetSection(JWTConfig.Section).Get<JWTConfig>();
        builder.Services.AddJWT(jwtConfig);
        // Register the custom filter with the DI container.
        builder.Services.AddScoped<UserIdFilterAttribute>();
        // Add a Login rate-limiter policy: 5 requests per 15 minutes per client IP
        builder.Services.AddLoginLimitRater(attempts: 5, miniutes: 15);

        // Register TransferFee services
        builder.Services.AddScoped<ITransferFeeRulesProvider, TransferFeeRulesProvider>();
        builder.Services.AddScoped<ITransferFeeService, TransferFeeService>();

        var app = builder.Build();
        
        // Configure URLs - bind to all interfaces in production
        if (app.Environment.IsProduction())
        {
            app.Urls.Clear();
            app.Urls.Add("http://0.0.0.0:5100");
        }
        
        // Register middleware first so it catches all exceptions
        app.UseMiddleware<ErrorHandlingMiddleware>();

        // use Swagger
        app.UseSwaggerConfig(app.Environment);

        // Configure the HTTP request pipeline.
        app.UseRouting();
        app.UseCors("AllowAll");
        app.UseRateLimiter();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        Console.WriteLine("Starting SettlyAI API server...");
        app.Run();
    }
}
