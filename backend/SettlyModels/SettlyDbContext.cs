using Microsoft.EntityFrameworkCore;
using SettlyModels.Entities;

namespace SettlyModels;

public class SettlyDbContext : DbContext
{
    public SettlyDbContext(DbContextOptions<SettlyDbContext> options) : base(options)
    {

    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Favourite> Favourites { get; set; } = null!;
    public DbSet<InspectionPlan> InspectionPlans { get; set; } = null!;
    public DbSet<LoanCalculation> LoanCalculations { get; set; } = null!;
    public DbSet<ChatLog> ChatLogs { get; set; } = null!;

    public DbSet<Property> Properties { get; set; } = null!;
    public DbSet<Suburb> Suburbs { get; set; } = null!;

    public DbSet<HousingMarket> HousingMarkets { get; set; } = null!;
    public DbSet<IncomeEmployment> IncomeEmployments { get; set; } = null!;
    public DbSet<PopulationSupply> PopulationSupplies { get; set; } = null!;
    public DbSet<Livability> Livabilities { get; set; } = null!;
    public DbSet<RiskDevelopment> RiskDevelopments { get; set; } = null!;
    public DbSet<SettlyAIScore> SettlyAIScores { get; set; } = null!;

    public DbSet<SuperProjectionInput> SuperProjectionInputs { get; set; } = null!;
    public DbSet<SuperProjectionResult> SuperProjectionResults { get; set; } = null!;
    public DbSet<SuperProjectionInsight> SuperProjectionInsights { get; set; } = null!;
    public DbSet<SuperFund> SuperFunds { get; set; } = null!;
    public DbSet<UserFundSelection> UserFundSelections { get; set; } = null!;

    public DbSet<PolicyRule> PolicyRules { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Property>()
            .Property(p => p.Features)
            .HasColumnType("text[]");
    }
}
