using ISettlyService;
using SettlyModels;
using SettlyModels.Dtos;
using Microsoft.EntityFrameworkCore;

namespace SettlyService
{
    public class PopulationSupplyService : IPopulationSupplyService
    {
        private readonly SettlyDbContext _context;
        public PopulationSupplyService(SettlyDbContext context)
        {
            _context = context;
        }
        public async Task<PopulationSupplyDto> GetPopulationSupplyDataAsync(int suburbId)
        {
            // Get the latest data responding to the suburb
            var populationSupply = await _context.PopulationSupplies
                                            .Where(i => i.SuburbId == suburbId)
                                            .OrderByDescending(i => i.SnapshotDate)
                                            .FirstOrDefaultAsync();
            if (populationSupply == null)
            {
                throw new Exception("Population supply data not found for the specified suburb.");
            }
            var populationSupplyDto = new PopulationSupplyDto
            {
                SuburbId = suburbId,
                RentersRatio = (float)populationSupply.RentersRatio,
                DemandSupplyRatio = populationSupply.DemandSupplyRatio,
                BuildingApprovals12M = populationSupply.BuildingApprovals12M,
                DevProjectsCount = populationSupply.DevProjectsCount
            };

            return populationSupplyDto;
        }
    }
}
