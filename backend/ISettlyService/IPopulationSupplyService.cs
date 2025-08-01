using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IPopulationSupplyService
    {
        Task<PopulationSupplyDto> GetPopulationSupplyDataAsync(int suburbId);
    }
}
