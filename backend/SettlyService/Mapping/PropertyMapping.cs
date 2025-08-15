using AutoMapper;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService.Mapping
{
    public class PropertyMappingProfile : Profile
    {
        public PropertyMappingProfile()
        {
            CreateMap<Property, PropertyDetailDto>()
            .AfterMap((src, dest) =>
            {
                dest.CreatedAt = DateTime.UtcNow;
                dest.UpdatedAt = DateTime.UtcNow;
            });
            CreateMap<Property, PropertyRecommendationDto>();
        }
    }
}
