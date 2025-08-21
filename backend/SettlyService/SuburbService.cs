using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Dtos.Suburb;

namespace SettlyService
{

    public class SuburbService(SettlyDbContext context, IMapper mapper) : ISuburbService
    {
        public async Task<SuburbDto?> GetSuburbsByIdAsync(int suburbId)
        {

            var suburb = await context.Suburbs.FindAsync(suburbId);
            if (suburb == null)
                //TODO:Change to global error handling middleware once it's done
                throw new NotImplementedException($"No report found for suburb id {suburbId}.");
            return mapper.Map<SuburbDto>(suburb);
        }

        public async Task<IncomeEmploymentDto?> GetIncomeAsync(int id)
        {
            var incomeEmploymentData = await context.IncomeEmployments
                .Where(i => i.SuburbId == id)
                .OrderByDescending(i => i.SnapshotDate)
                .FirstOrDefaultAsync();

            if (incomeEmploymentData == null)
                throw new Exception("No income employment data found.");
            return mapper.Map<IncomeEmploymentDto>(incomeEmploymentData);
        }

        public async Task<HousingMarketDto?> GetHousingMarketAsync(int id)
        {
            var housingMarket = await context.HousingMarkets
            .AsNoTracking()
            .Where(hm => hm.SuburbId == id)
            .OrderByDescending(hm => hm.SnapshotDate)
            .FirstOrDefaultAsync();
            if (housingMarket == null)
                //TODO:Change to global error handling middleware once it's done
                throw new KeyNotFoundException($"Housing market not found.");
            return mapper.Map<HousingMarketDto>(housingMarket);
        }

        public async Task<PopulationSupplyDto?> GetDemandDevAsync(int id)
        {
            throw new NotImplementedException();
        }


        public async Task<LivabilityDto?> GetLivabilityAsync(int id)
        {
            var lifeStyle = await context.Livabilities.AsNoTracking().Where(l => l.SuburbId == id).OrderByDescending(l => l.SnapshotDate)
                .FirstOrDefaultAsync();
            if (lifeStyle == null)
                //TODO:Change to global error handling middleware once it's done
                throw new KeyNotFoundException($"Livability not found.");
            return mapper.Map<LivabilityDto>(lifeStyle);
        }

        public async Task<RiskDevelopmentDto?> GetSafetyAsync(int id)
        {
            throw new NotImplementedException();
        }

<<<<<<< HEAD
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

||||||| parent of 6769b48 (feat: add suburb snapshot api)
=======
        public async Task<SuburbSnapshotDto> GetSnapshotAsync(int id)
        {
            var suburb = await context.Suburbs.FindAsync(id);
            if (suburb == null)
                throw new NotImplementedException($"No Snapshot found for suburb id {id}.");
            var housingMarket = await context.HousingMarkets.AsNoTracking().Where(l => l.SuburbId == id).OrderByDescending(l => l.SnapshotDate).FirstOrDefaultAsync();
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
>>>>>>> 6769b48 (feat: add suburb snapshot api)
    }
}


