using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ISuburbService
    {
        Task<SuburbDto?> GetSuburbsByIdAsync(int id);
        Task<IncomeEmploymentDto?> GetIncomeAsync(int id);
        Task<HousingMarketDto?> GetHousingMarketAsync(int id);
        Task<PopulationSupplyDto?> GetDemandDevAsync(int id);
        Task<LivabilityDto?> GetLivabilityAsync(int id);
        Task<RiskDevelopmentDto?> GetSafetyAsync(int id);
        Task<SuburbSnapshotDto> GetSnapshotAsync(int id);
    }
}
