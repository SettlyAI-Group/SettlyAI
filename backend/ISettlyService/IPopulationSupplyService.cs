using SettlyModels.Dtos.Suburb;

namespace ISettlyService
{
    public interface IPopulationSupplyService
    {
        Task<PopulationSupplyDto> GetPopulationSupplyDataAsync(int suburbId);
    }
}
