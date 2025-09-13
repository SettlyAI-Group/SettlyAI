using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SettlyModels;

namespace SettlyDbManager;

public class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            // 构建配置
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                Console.WriteLine("❌ 数据库连接字符串未找到！");
                Console.WriteLine("请创建 appsettings.Development.json 文件并配置数据库连接。");
                return;
            }

            // 配置数据库上下文
            var options = new DbContextOptionsBuilder<SettlyDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            using var context = new SettlyDbContext(options);
            var seeder = new DataSeeder(context);

            // 解析命令行参数
            var command = args.Length > 0 ? args[0] : "--help";

            switch (command)
            {
                case "--seed":
                    Console.WriteLine("🌱 生成测试数据...");
                    await seeder.SeedAllAsync();
                    Console.WriteLine("✅ 数据生成完成！");
                    break;

                case "--reset":
                    Console.WriteLine("🔄 重置数据库并生成新数据...");
                    await seeder.SeedAllAsync();
                    Console.WriteLine("✅ 数据库重置完成！");
                    break;

                case "--suburbs":
                    Console.WriteLine("🏘️ 重新生成 suburb 数据...");
                    await seeder.ReseedSuburbsAndRelatedDataAsync();
                    Console.WriteLine("✅ Suburb 数据生成完成！");
                    break;

                case "--clear":
                    Console.WriteLine("🧹 清空所有数据...");
                    await seeder.ClearAllDataAsync();
                    Console.WriteLine("✅ 数据库已清空！");
                    break;

                default:
                    ShowHelp();
                    break;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ 错误: {ex.Message}");
        }
    }

    private static void ShowHelp()
    {
        Console.WriteLine("SettlyAI Database Manager");
        Console.WriteLine("========================");
        Console.WriteLine();
        Console.WriteLine("用法: dotnet run [命令]");
        Console.WriteLine();
        Console.WriteLine("命令:");
        Console.WriteLine("  --seed     生成完整的测试数据");
        Console.WriteLine("  --suburbs  重新生成 suburb 数据（从 CSV 文件）");
        Console.WriteLine("  --clear    清空所有数据");
        Console.WriteLine("  --help     显示帮助信息");
        Console.WriteLine();
        Console.WriteLine("示例:");
        Console.WriteLine("  dotnet run --seed      # 首次设置");
        Console.WriteLine("  dotnet run --suburbs   # 更新 suburb 数据");
        Console.WriteLine("  dotnet run --clear     # 清空数据");
        Console.WriteLine("  dotnet run --clear && dotnet run --seed  # 清空并重新生成");
    }
}
