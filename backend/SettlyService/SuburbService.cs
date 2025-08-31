using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

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
            if(lifeStyle == null)
                //TODO:Change to global error handling middleware once it's done
                throw new KeyNotFoundException($"Livability not found.");
            return mapper.Map<LivabilityDto>(lifeStyle);
        }

        public async Task<RiskDevelopmentDto?> GetSafetyAsync(int id)
        {
            throw new NotImplementedException();
        }

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
    }
}
