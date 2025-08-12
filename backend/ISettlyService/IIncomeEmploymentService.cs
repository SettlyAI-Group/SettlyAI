using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IIncomeEmploymentService
    {
        Task<IncomeEmploymentDto> GetIncomeEmploymentDataAsync(int suburbId);
    }
}
