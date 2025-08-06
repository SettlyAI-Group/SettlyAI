using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService
{

    public class SuburbReportService : ISuburbReportService
    {
        private readonly SettlyDbContext _context;
        private readonly IMapper _mapper;
        public SuburbReportService(SettlyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SuburbReportDto?> GenerateSuburbReportAsync(int suburbId)
        {

            var suburb = await _context.Suburbs.FindAsync(suburbId);
            if (suburb == null)
                throw new Exception($"No report found for suburb id {suburbId}.");


            var incomeEmployment = _context.IncomeEmployments.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();
            var housingMarket = _context.HousingMarkets.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();
            var livability = _context.Livabilities.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();
            var populationSupply = _context.PopulationSupplies.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();
            var settlyAIScore = _context.SettlyAIScores.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();
            var riskDevelopment = _context.RiskDevelopments.Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefault();

            var report = new SuburbReportDto
            {
                Id = $"{suburb.Id}_{DateTime.UtcNow:yyyyMMdd}",
                SuburbId = suburb.Id,
                State = suburb.State,
                Postcode = suburb.Postcode,
                SuburbName = suburb.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IncomeEmployment = _mapper.Map<IncomeEmploymentDto>(incomeEmployment),
                HousingMarket = _mapper.Map<HousingMarketDto>(housingMarket),
                PopulationSupply = _mapper.Map<PopulationSupplyDto>(populationSupply),
                Livability = _mapper.Map<LivabilityDto>(livability),
                RiskDevelopment = _mapper.Map<RiskDevelopmentDto>(riskDevelopment),
                SettlyAIScore = _mapper.Map<SettlyAIScoreDto>(settlyAIScore)

            };


            return report;
        }

    }
}
