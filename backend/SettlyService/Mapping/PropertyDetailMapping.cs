using AutoMapper;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService.Mapping
{
    public class PropertyDetailMappingProfile : Profile
    {
        public PropertyDetailMappingProfile()
        {
            CreateMap<Property, PropertyDetailDto>()
            .AfterMap((src, dest) =>
            {
                dest.CreatedAt = DateTime.UtcNow;
                dest.UpdatedAt = DateTime.UtcNow;
            });
        }
    }
}
