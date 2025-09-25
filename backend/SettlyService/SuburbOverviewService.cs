using System.ComponentModel;
using System.Linq.Expressions;
using SettlyModels.Entities;
using System.Reflection.Metadata.Ecma335;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyService
{
    public class SuburbOverviewService : ISuburbOverview
    {
        private readonly SettlyDbContext _context;

        public SuburbOverviewService(SettlyDbContext context)
        {
            _context = context;
        }


        public async Task<SuburbOverviewDto> GetSuburbOverviewAsync(MapInputDto input)
        {
            var suburb = await GetSuburbAsyc(input);
            var suburbId = suburb.Id;
            var metrics = await GetMetricsAsyc(suburbId);

            var medianPrice = metrics.MedianPrice;
            var priceGrowth3yr = metrics.PriceGrowth3Yr;
            var summary = await GetSummary(medianPrice, priceGrowth3yr);

            var highlights = await GetHighlight(metrics);
            return new SuburbOverviewDto
            {
                Suburb = suburb,
                Metrics = metrics,
                Summary = summary,
                Highlights = highlights,
            };
        }


        //1-Suburb Section
        //Convert data state from frontend to statecode
        private static readonly Dictionary<string, string> StateCodes =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["New South Wales"] = "NSW",
                ["Victoria"] = "VIC",
                ["Queensland"] = "QLD",
                ["South Australia"] = "SA",
                ["Western Australia"] = "WA",
                ["Tasmania"] = "TAS",
                ["Northern Territory"] = "NT",
                ["Australian Capital Territory"] = "ACT"
            };

        private static string GetStatecode(string stateName)
        {
            return StateCodes.TryGetValue(stateName, out var code)
            ? code
            : stateName;
        }

        //Getting Suburb data
        private async Task<SuburbOverviewSuburbDto> GetSuburbAsyc(MapInputDto input)
        {
            var postcodeMatch = await PostCodeMatching(input.Postcode);
            if (postcodeMatch != null)
            {
                return postcodeMatch;
            }
            var suburbMatch = await suburbMatching(input.Suburb);
            if (suburbMatch != null)
            {
                return suburbMatch;
            }
            var stateCode = GetStatecode(input.State);
            return await statebMatching(stateCode);
        }
        private async Task<SuburbOverviewSuburbDto?> PostCodeMatching(string postcode)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Postcode, postcode))
                 .Select(ToSuburbDto())
                .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto?> suburbMatching(string suburb)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Name, suburb))
                  .Select(ToSuburbDto())
                 .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto> statebMatching(string state)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Name, state))
                    .Select(ToSuburbDto())
                 .FirstAsync();
        }

        private static Expression<Func<Suburb, SuburbOverviewSuburbDto>> ToSuburbDto()
        {
            return s => new SuburbOverviewSuburbDto
            {
                Id = s.Id,
                Name = s.Name,
                State = s.State,
                Postcode = s.Postcode
            };
        }

        //2-Metrics Section
        private async Task<SuburbOverviewMetricsDto> GetMetricsAsyc(int suburbId)
        {
            var price = await metricsPrice(suburbId);
            var crime = await metricsCrime(suburbId);
            var affortability = await metricsAffortability(suburbId);
            return new SuburbOverviewMetricsDto
            {
                MedianPrice = price.MedianPrice,
                PriceGrowth3Yr = price.PriceGrowth3Yr,
                Safety = crime,
                Affordability = affortability,
            };

        }

        private async Task<(int MedianPrice, decimal PriceGrowth3Yr)> metricsPrice(int suburbId)
        {
            var data = await _context.HousingMarkets
                .Where(h => h.SuburbId == suburbId)
                .Select(h => new { h.MedianPrice, h.PriceGrowth3Yr })
                .FirstAsync();
            return (data.MedianPrice, data.PriceGrowth3Yr);

        }

        private async Task<SafetyDto> metricsCrime(int suburbId)
        {
            var crimeRate = await _context.RiskDevelopments
                .Where(r => r.SuburbId == suburbId)
                .Select(r => r.CrimeRate)
                .FirstAsync();

            var crimeLevel = crimeRate switch
            {
                <= 3m => "low",
                <= 6m => "medium",
                _ => "high"
            };

            return new SafetyDto
            {
                CrimeLevel = crimeLevel,
                SafetyLabel = crimeLevel switch
                {
                    "low" => "High",
                    "medium" => "Medium",
                    "high" => "Low",
                    _ => "Unknown"
                }
            };

        }

        private async Task<AffordabilityDto> metricsAffortability(int suburbId)
        {
            var affordabilityScore = await _context.SettlyAIScores
                .Where(s => s.SuburbId == suburbId)
                .Select(s => s.AffordabilityScore)
                .FirstAsync();

            var affortableLevel = affordabilityScore switch
            {
                <= 3m => "High",
                <= 6m => "Medium",
                _ => "Low"
            };

            return new AffordabilityDto
            {
                Score = affordabilityScore,
                Label = affortableLevel
            };
        }

        //3-Summary Section
        private async Task<SuburbOverviewSummaryDto> GetSummary(int medianPrice, decimal priceGrowth3yr)
        {
            var millionUnit = 1000000;
            var text = $"Carnegie’s median price is ${medianPrice / millionUnit}M, with {priceGrowth3yr}% growth over the past 3 years. Safety is rated High, and affordability is High.";
            var status = "ready";
            var source = "template";
            return new SuburbOverviewSummaryDto
            {
                Text = text,
                Status = status,
                Source = source,
            };
        }

        //4-Highlight Section
        private async Task<IReadOnlyList<string>> GetHighlight(SuburbOverviewMetricsDto metrics)
        {
            var highlight = new List<string>();

            var safetyLabel = metrics.Safety?.SafetyLabel;
            if (string.Equals(safetyLabel, "High", StringComparison.OrdinalIgnoreCase))
            {
                highlight.Add("Low Crime");
            }

            decimal priceGrowth3yr = metrics.PriceGrowth3Yr;
            const decimal priceGrowthThreshold = 3.0m;
            if (priceGrowth3yr <= priceGrowthThreshold)
            {
                highlight.Add("Affordable Choicee");
            }



            decimal affortableScore = metrics.Affordability.Score;
            const decimal affordThreshold = 6.0m;
            if (affortableScore >= affordThreshold)
            {
                highlight.Add("Affortable Choice");
            }

            return highlight;

        }
    }
}
