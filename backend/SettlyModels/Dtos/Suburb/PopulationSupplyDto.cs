using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.Dtos;

public class PopulationSupplyDto
{
    public int SuburbId { get; set; }
    public decimal RentersRatio { get; set; }
    public decimal DemandSupplyRatio { get; set; }
    public int BuildingApprovals12M { get; set; }
    public int DevProjectsCount { get; set; }
}