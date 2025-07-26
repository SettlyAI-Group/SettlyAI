namespace SettlyModels.Entities;

public class PopulationSupply
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public int Population { get; set; }
    public decimal PopulationGrowthRate { get; set; }
    public decimal RentersRatio { get; set; }
    public string LandSupply { get; set; } = null!;
    public int BuildingApprovals12M { get; set; }
    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}