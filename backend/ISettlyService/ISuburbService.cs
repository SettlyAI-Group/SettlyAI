using SettlyModels.Dtos;
using SettlyModels.Dtos.Suburb;

namespace ISettlyService
{
    public interface ISuburbService
    {
        Task<SuburbDto?> GetSuburbsByIdAsync(int id);
        Task<IncomeEmploymentDto?> GetIncomeAsync(int id);
        Task<HousingMarketDto?> GetMarketAsync(int id);
        Task<PopulationSupplyDto?> GetDemandDevAsync(int id);
        Task<LivabilityDto?> GetLivabilityAsync(int id);
        Task<RiskDevelopmentDto?> GetSafetyAsync(int id);
<<<<<<< HEAD
        Task<SafetyScoreOutputDto?> GetSafetyScoresAsync(int id);
||||||| parent of 6769b48 (feat: add suburb snapshot api)
=======
        Task<SuburbSnapshotDto> GetSnapshotAsync(int id);
>>>>>>> 6769b48 (feat: add suburb snapshot api)
    }
}
