using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ISuburbReportService
    {
        Task<SuburbReportDto?> GenerateSuburbReportAsync(int id);
    }
}
