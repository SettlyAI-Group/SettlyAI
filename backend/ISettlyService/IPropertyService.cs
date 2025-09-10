using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface IPropertyService
    {
        Task<PropertyDetailDto> GeneratePropertyDetailAsync(int id);
        Task<List<PropertyRecommendationDto>> GetSimilarPropertiesAsync(int id);
        Task<List<DateTime>> GetInspectionTimeOptionsAsync(int propertyId);
    }
}


