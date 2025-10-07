namespace SettlyModels.Entities;

public class PopulationSupply
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public decimal RentersRatio { get; set; }
    public decimal DemandSupplyRatio { get; set; }
    public int BuildingApprovals12M { get; set; }
    public DateTime SnapshotDate { get; set; }
    public int DevProjectsCount { get; set; }

    public Suburb Suburb { get; set; } = null!;
}
