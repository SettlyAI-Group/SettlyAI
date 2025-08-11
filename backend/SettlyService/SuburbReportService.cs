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

            var incomeEmployment = await _context.IncomeEmployments.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();
            var housingMarket = await _context.HousingMarkets.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();
            var livability = await _context.Livabilities.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();
            var populationSupply = await _context.PopulationSupplies.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();
            var settlyAIScore = await _context.SettlyAIScores.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();
            var riskDevelopment = await _context.RiskDevelopments.AsNoTracking().Where(i => i.SuburbId == suburbId).OrderByDescending(i => i.Id).FirstOrDefaultAsync();

            var now = DateTime.UtcNow;
            var report = new SuburbReportDto
            {
                Id = $"{suburb.Id}_{now:yyyyMMdd}",
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
