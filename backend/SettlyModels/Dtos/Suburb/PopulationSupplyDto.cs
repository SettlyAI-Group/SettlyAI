namespace SettlyModels.Dtos.Suburb;

public class PopulationSupplyDto
{
    public int SuburbId { get; set; }
    public decimal RentersRatio { get; set; }
    public decimal DemandSupplyRatio { get; set; }
    public int BuildingApprovals12M { get; set; }
    public int DevProjectsCount { get; set; }
}
