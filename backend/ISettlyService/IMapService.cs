using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IMapService
    {
        public Task<int> GetSuburbId(MapInputDto input);
    }
}
