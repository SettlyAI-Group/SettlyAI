using AutoMapper;
using SettlyModels.Dtos;
using SettlyModels.Entities;
using SettlyService.Factories;

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
            CreateMap<ScoresCardsAggregateDto, List<ScoreCardDto>>().ConvertUsing(src => ScoreCardFactory.Build(src));
            CreateMap<Suburb, SuburbDto>();
        }
    }
}
