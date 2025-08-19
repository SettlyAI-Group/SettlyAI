using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyService
{

    public class SuburbService : ISuburbService
    {
        private readonly SettlyDbContext _context;
        private readonly IMapper _mapper;
        public SuburbService(SettlyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SuburbDto?> GetSuburbsByIdAsync(int suburbId)
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
            var suburbData = new SuburbDto
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

            return suburbData;
        }

        public async Task<IncomeEmploymentDto?> GetIncomeAsync(int id)
        {
            var incomeEmploymentData = await _context.IncomeEmployments
                .Where(i => i.SuburbId == id)
                .OrderByDescending(i => i.SnapshotDate)
                .FirstOrDefaultAsync();

            if (incomeEmploymentData == null)
                throw new Exception("No income employment data found.");
            return _mapper.Map<IncomeEmploymentDto>(incomeEmploymentData);
        }

        public async Task<HousingMarketDto?> GetMarketAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<PopulationSupplyDto?> GetDemandDevAsync(int id)
        {
            throw new NotImplementedException();
        }


        public async Task<LivabilityDto?> GetLivabilityAsync(int id)
        {
            var lifeStyle = await _context.Livabilities.AsNoTracking().Where(l => l.SuburbId == id).OrderByDescending(l => l.SnapshotDate)
                .FirstOrDefaultAsync();
            if(lifeStyle == null)
                //TODO:Change to global error handling middleware once it's done
                throw new KeyNotFoundException($"Livability not found.");
            return _mapper.Map<LivabilityDto>(lifeStyle);
        }

        public async Task<RiskDevelopmentDto?> GetSafetyAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<SuburbSnapshotDto> GetSnapshotAsync(int id)
        {
            var suburb = await _context.Suburbs.FindAsync(id);
            if (suburb == null)
                throw new NotImplementedException($"No Snapshot found for suburb id {id}.");
            var housingMarket = await _context.HousingMarkets.AsNoTracking().Where(l => l.SuburbId == id).OrderByDescending(l => l.SnapshotDate).FirstOrDefaultAsync();
            var now = DateTime.UtcNow;
            var snapshot = new SuburbSnapshotDto
            {
                Id = $"{suburb.Id}_{now:yyyyMMdd}",
                State = suburb.State,
                Postcode = suburb.Postcode,
                SuburbName = suburb.Name,
                MedianPrice = housingMarket?.MedianPrice,
                VacancyRatePct = housingMarket?.VacancyRate,
            };
            return snapshot;
        }
    }
}
