using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.Dtos;

public class PopulationSupplyDto
{
    public int SuburbId { get; set; }
    public int Population { get; set; }
    public float PopulationGrowthRate { get; set; }
    public float RentersRatio { get; set; }
    public decimal DemandSupplyRatio { get; set; }
    public string LandSupply { get; set; } = string.Empty;
    public int DevProjectsCount { get; set; }
    public int BuildingApprovals12M { get; set; }

}
