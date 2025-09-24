using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ISuburbOverview
    {       
        public Task<SuburbOverviewDto> GetSuburbOverviewAsync(MapInputDto input);
    }
}
