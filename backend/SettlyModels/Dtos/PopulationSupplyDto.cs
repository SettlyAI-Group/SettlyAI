namespace SettlyModels.Dtos;

public class PopulationSupplyDto
{
    public decimal RentersRatio { get; set; }
    public decimal DemandSupplyRatio { get; set; }
    public int BuildingApprovals12M { get; set; }
    public int DevProjectsCount { get; set; }
}