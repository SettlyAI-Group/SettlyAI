using AutoMapper;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService.Mapping
{
    public class SuburbMappingProfile : Profile
    {
        public SuburbMappingProfile()
        {
            CreateMap<IncomeEmployment, IncomeEmploymentDto>();
            CreateMap<HousingMarket, HousingMarketDto>();
            CreateMap<Livability, LivabilityDto>();
            CreateMap<PopulationSupply, PopulationSupplyDto>();
            CreateMap<RiskDevelopment, RiskDevelopmentDto>();
            CreateMap<SettlyAIScore, SettlyAIScoreDto>();
            CreateMap<Suburb, SuburbDto>();
        }
    }
}
