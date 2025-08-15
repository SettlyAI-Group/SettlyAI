using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IPropertyDetailService
    {
        Task<PropertyDetailDto> GeneratePropertyDetailAsync(int id);
    }
}


