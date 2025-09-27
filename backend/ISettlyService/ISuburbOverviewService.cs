using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ISuburbOverviewService
    {       
        public Task<SuburbOverviewDto?> GetSuburbOverviewAsync(MapInputDto input);
    }
}
