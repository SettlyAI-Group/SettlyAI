using System.Threading.RateLimiting;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SettlyApi.Configuration;
using SettlyModels;
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
                builder.Services.AddTransient<ICreateTokenService, CreateTokenService>();
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

                        // Add JWT Authorization
                        options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
                        {
                                Description = "please 'Bearer+space+token'，For instance：Bearer eyJhbGciOi...",
                                Name = "Authorization",
                                In = ParameterLocation.Header,
                                Type = SecuritySchemeType.ApiKey,
                                Scheme = "Bearer"
                        });
                        options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                    {
                {
                    new OpenApiSecurityScheme()
                    {
                        Reference=new OpenApiReference()
                        {
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new List<string>()
                }
                    });
                });

                // JWT configration
                builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection(JWTConfig.Section));
                var jwtConfig = builder.Configuration.GetSection(JWTConfig.Section).Get<JWTConfig>();
                builder.Services.AddJWT(jwtConfig);

                // Add a rate-limiter policy: 5 requests per 15 minutes per client IP
                builder.Services.AddRateLimiter(options =>
                {
                        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                        options.AddPolicy("LoginIpFixedWindow", httpContext =>
                {
                            var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                            return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ip,
                        factory: _ => new FixedWindowRateLimiterOptions
                            {
                                    PermitLimit = 5,                       // <= 5 attempts ...
                                    Window = TimeSpan.FromMinutes(15),     // ... every 15 minutes
                                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                                    QueueLimit = 0                         // don't queue, just reject
                            });
                    });
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
                app.UseRateLimiter();
                app.UseAuthentication();
                app.UseAuthorization();
                app.MapControllers();

                Console.WriteLine("Starting SettlyAI API server...");
                app.Run();
        }
}
