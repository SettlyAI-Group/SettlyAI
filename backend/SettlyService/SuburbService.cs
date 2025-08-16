using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Dtos.Suburb;

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
            throw new NotImplementedException();
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
            if (lifeStyle == null)
                //TODO:Change to global error handling middleware once it's done
                throw new KeyNotFoundException($"Livability not found.");
            return _mapper.Map<LivabilityDto>(lifeStyle);

        }

        public async Task<RiskDevelopmentDto?> GetSafetyAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<SafetyScoreOutputDto?> GetSafetyScoresAsync(int suburbId)
        {
            var report = await GetSuburbsByIdAsync(suburbId);
            if (report == null)
                return null;

            var crimeRate = report.RiskDevelopment?.CrimeRate ?? 5.0f;
            var affordabilityScore = report.SettlyAIScore?.AffordabilityScore ?? 5.0f;
            var growthPotential = report.SettlyAIScore?.GrowthPotentialScore ?? 6.0f;

            return new SafetyScoreOutputDto(
                CrimeRate: new SafetyScoreDto(
                    Id: "crime-rate",
                    Title: "Crime Rate",
                    Value: crimeRate.ToString("F1"),
                    MaxValue: "1,000",
                    ProgressPercentage: CalculateInversePercentage(crimeRate, 1000),
                    Label: GetCrimeRateLabel((float)crimeRate),
                    Color: "success"
                ),

                AffordabilityScore: new SafetyScoreDto(
                    Id: "affordability",
                    Title: "Affordability Score",
                    Value: affordabilityScore.ToString("F1"),
                    MaxValue: "10",
                    ProgressPercentage: CalculateNormalPercentage((double)affordabilityScore, 10),
                    Label: null,
                    Color: "primary"
                ),

                GrowthPotentialScore: new SafetyScoreDto(
                    Id: "growth-potential",
                    Title: "Growth Potential",
                    Value: growthPotential.ToString("F1"),
                    MaxValue: "10",
                    ProgressPercentage: CalculateNormalPercentage((double)growthPotential, 10),
                    Label: null,
                    Color: "success"
                )
            );
        }

        private const float DEFAULT_CRIME_RATE = 5.0f;
        private const float DEFAULT_AFFORDABILITY = 5.0f;
        private const float DEFAULT_GROWTH_POTENTIAL = 6.0f;

        #region 
        private float ExtractCrimeRateFromDto(RiskDevelopmentDto? riskDto)
        {
            return riskDto?.CrimeRate ?? DEFAULT_CRIME_RATE;
        }

        private float ExtractAffordabilityFromDto(SettlyAIScoreDto? scoreDto)
        {
            return scoreDto?.AffordabilityScore ?? DEFAULT_AFFORDABILITY;
        }

        private float ExtractGrowthFromDto(SettlyAIScoreDto? scoreDto)
        {
            return scoreDto?.GrowthPotentialScore ?? DEFAULT_GROWTH_POTENTIAL;
        }

        #endregion

        private static int CalculateInversePercentage(double value, double maxValue)
        {
            return (int)Math.Min(100, Math.Max(0, (1 - (double)value / maxValue) * 100));
        }

        private static int CalculateNormalPercentage(double value, double maxValue)
        {
            return (int)Math.Min(100, Math.Max(0, ((double)value / maxValue) * 100));
        }

        private static string GetCrimeRateLabel(float crimeRate)
        {
            return (float)crimeRate switch
            {
                <= 5.0f => "Low",
                <= 15.0f => "Medium",
                _ => "High"
            };
        }

    }
}


