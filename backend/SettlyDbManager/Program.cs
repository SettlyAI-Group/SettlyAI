using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SettlyModels;

namespace SettlyDbManager;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        // Parse command line arguments
        var dbOptions = DatabaseOptions.Parse(args);

        // Show help and exit if requested
        if (dbOptions.Help)
        {
            DatabaseOptions.ShowHelp();
            return 0;
        }

        // If no operations specified, show help
        if (!dbOptions.HasDatabaseOperations)
        {
            Console.WriteLine("No database operations specified. Use --help for available options.");
            return 1;
        }

        try
        {
            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            // Build services
            var services = new ServiceCollection();
            var apiConfigs = configuration.GetSection("ApiConfigs").Get<ApiConfigs>();

            if (apiConfigs?.DBConnection == null)
            {
                Console.WriteLine("ERROR: Database connection string not found in configuration.");
                return 1;
            }

            services.AddDbContext<SettlyDbContext>(options => options
                .UseNpgsql(apiConfigs.DBConnection)
                .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
            );

            services.AddScoped<DataSeeder>();

            var serviceProvider = services.BuildServiceProvider();

            // Execute database operations
            using var scope = serviceProvider.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

            // Execute seeding operations if requested
            if (dbOptions.Seed)
            {
                Console.WriteLine("Generating fake data...");
                await seeder.SeedAllAsync();
                Console.WriteLine("Fake data generation completed successfully!");
            }
            else if (dbOptions.ResetSeed)
            {
                if (environment != "Development")
                {
                    Console.WriteLine("ERROR: --reset-seed is only available in Development environment!");
                    return 1;
                }

                Console.WriteLine("WARNING: This will clear all existing data and generate new fake data.");
                Console.WriteLine("Resetting database and generating new fake data...");
                await seeder.SeedAllAsync();
                Console.WriteLine("Database reset and fake data generation completed successfully!");
            }

            Console.WriteLine("Database operations completed successfully!");
            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database operation failed: {ex.Message}");
            Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return 1;
        }
    }
}
