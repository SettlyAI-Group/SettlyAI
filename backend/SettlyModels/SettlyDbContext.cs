using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace SettlyModels
{
    public class SettlyDbContextFactory : IDesignTimeDbContextFactory<SettlyDbContext>
    {
        public SettlyDbContext CreateDbContext(string[] args)
        {
            // Build configuration with environment variables support
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            // Try to get connection string from multiple sources
            var dbConnection =
                configuration.GetSection("ApiConfigs").GetValue<string>("DBConnection")
                ?? configuration.GetConnectionString("DefaultConnection")
                ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

            if (string.IsNullOrEmpty(dbConnection))
            {
                throw new InvalidOperationException("Database connection string not found in configuration or environment variables.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<SettlyDbContext>();
            optionsBuilder.UseNpgsql(dbConnection);

            return new SettlyDbContext(optionsBuilder.Options);
        }
    }
}