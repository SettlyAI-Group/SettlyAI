using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IFhssService
    {
        decimal? ProcessFhssAmount(SuperEstimateRequestDto request);
    }
}
