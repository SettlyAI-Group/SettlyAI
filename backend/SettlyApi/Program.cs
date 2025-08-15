
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SettlyModels;
using SettlyApi.Configuration;
using SettlyService; // Add this if IAuthService is in ISettlyService.Auth namespace


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
    public static void Main(string[] args)
        {
                var builder = WebApplication.CreateBuilder(args);
                builder.WebHost.UseUrls("http://0.0.0.0:5100");
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
                        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
                        builder.Services.AddScoped<ISuburbService, SuburbService>();
                        builder.Services.AddScoped<IPropertyService, PropertyService>();
                        builder.Services.AddScoped<IFavouriteService, FavouriteService>();
                        builder.Services.AddTransient<IPopulationSupplyService, PopulationSupplyService>();


                        // JWT configration
                        builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection(JWTConfig.Section));
                        var jwtConfig = builder.Configuration.GetSection(JWTConfig.Section).Get<JWTConfig>();
                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                    options.TokenValidationParameters = new TokenValidationParameters()
                                    {
                                            ValidateIssuer = true,
                                            ValidIssuer = jwtConfig.Issuer,
                                            ValidateAudience = true,
                                            ValidAudience = jwtConfig.Audience,
                                            ValidateLifetime = true,
                                            ValidateIssuerSigningKey = true,
                                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey))
                                    };
                            });

                        var app = builder.Build();

                        // Configure the HTTP request pipeline.
                        app.UseRouting();
                        app.UseCors("AllowAll");
                        app.UseAuthorization();
                        app.MapControllers();

                        Console.WriteLine("Starting SettlyAI API server...");
                        app.Run();
                }
        }
