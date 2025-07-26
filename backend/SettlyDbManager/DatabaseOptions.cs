namespace SettlyDbManager;

public class DatabaseOptions
{
    public bool Seed { get; set; }         // --seed  
    public bool ResetSeed { get; set; }    // --reset-seed
    public bool Help { get; set; }         // --help

    public static DatabaseOptions Parse(string[] args)
    {
        var options = new DatabaseOptions();
        
        foreach (var arg in args)
        {
            switch (arg.ToLowerInvariant())
            {
                case "--seed":
                    options.Seed = true;
                    break;
                case "--reset-seed":
                    options.ResetSeed = true;
                    break;
                case "--help":
                case "-h":
                    options.Help = true;
                    break;
            }
        }
        
        return options;
    }

    public static void ShowHelp()
    {
        Console.WriteLine("SettlyAI Database Manager - Database Operations Tool");
        Console.WriteLine("=========================================");
        Console.WriteLine();
        Console.WriteLine("Usage: dotnet run [options]");
        Console.WriteLine();
        Console.WriteLine("Options:");
        Console.WriteLine("  --seed        Generate fake data for development");
        Console.WriteLine("  --reset-seed  Clear all data and generate new fake data");
        Console.WriteLine("  --help, -h    Show this help message");
        Console.WriteLine();
        Console.WriteLine("Examples:");
        Console.WriteLine("  dotnet run --seed         # Generate fake data");
        Console.WriteLine("  dotnet run --reset-seed   # Reset and generate new data");
        Console.WriteLine();
        Console.WriteLine("Note: --reset-seed is only available in Development environment");
    }

    public bool HasDatabaseOperations => Seed || ResetSeed;
}