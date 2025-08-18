// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Design;
// using Microsoft.Extensions.Configuration;

// namespace SettlyModels
// {
//     public class SettlyDbContextFactory : IDesignTimeDbContextFactory<SettlyDbContext>
//     {
//         public SettlyDbContext CreateDbContext(string[] args)
//         {
//             //  Web 项目的 appsettings.json
//             var configuration = new ConfigurationBuilder()
//                 .SetBasePath(Directory.GetCurrentDirectory()) // CLI 启动路径
//                 .AddJsonFile(Path.Combine("../SettlyApi", "appsettings.Development.json")) // 相对路径
//                 .Build();

//            var connectionString = configuration["ApiConfigs:DBConnection"];

//             var optionsBuilder = new DbContextOptionsBuilder<SettlyDbContext>();
//             optionsBuilder.UseSqlServer(connectionString);

//             return new SettlyDbContext(optionsBuilder.Options);
//         }
//     }
// }
