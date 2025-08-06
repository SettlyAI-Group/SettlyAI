namespace SettlyModels.Dtos;

public class PopulationSupplyDto
{
    public int Population { get; set; }
    public float PopulationGrowthRate { get; set; }
    public float RentersRatio { get; set; }
    public string LandSupply { get; set; } = string.Empty;
    public int DevProjectsCount { get; set; }
    public int BuildingApprovals12M { get; set; }
}
