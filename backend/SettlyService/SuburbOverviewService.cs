using System.Linq.Expressions;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService
{
    public class SuburbOverviewService : ISuburbOverviewService
    {
        private readonly SettlyDbContext _context;

        public SuburbOverviewService(SettlyDbContext context)
        {
            _context = context;
        }

        public async Task<SuburbOverviewDto> GetSuburbOverviewAsync(MapInputDto input)
        {
            var suburb = await GetSuburbAsync(input);    
             if (suburb == null)
            {
                return new SuburbOverviewDto
                {
                    Suburb = null,
                    Metrics = null,
                    Summary = null,
                    Highlights = Array.Empty<string>()
                };
            }
            var metrics = await GetMetricsAsync(suburb);            
            var summary = GetSummary(metrics, suburb);
            var highlights = GetHighlight(metrics);
            return new SuburbOverviewDto
            {
                Suburb = suburb,
                Metrics = metrics,
                Summary = summary,
                Highlights = highlights,
            };
        }

        #region Help Functions        
        //Convert data state from frontend to statecode
        private static readonly Dictionary<string, string> ConvertStateCodes =
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
            return ConvertStateCodes.TryGetValue(stateName, out var stateCode)
            ? stateCode
            : stateName;
        }

        //1-Suburb Section
        private async Task<SuburbOverviewSuburbDto?> GetSuburbAsync(MapInputDto input)
        {
            var postcodeMatch = await PostCodeMatching(input.Postcode);
            if (postcodeMatch != null)
            {
                return postcodeMatch;
            }
            var suburbMatch = await SuburbMatching(input.Suburb);
            if (suburbMatch != null)
            {
                return suburbMatch;
            }
            var stateCode = GetStatecode(input.State);
            var stateCodeMatch = await StateCodeMatching(stateCode);
            if (stateCodeMatch != null)
            {
                return stateCodeMatch;
            }
            return null;
        }
        private async Task<SuburbOverviewSuburbDto?> PostCodeMatching(string postcode)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Postcode, postcode))
                 .Select(ToSuburbDto())
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto?> SuburbMatching(string suburb)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Name, suburb))
                  .Select(ToSuburbDto())
                 .AsNoTracking()
                 .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto?> StateCodeMatching(string stateCode)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.State, stateCode))
                    .Select(ToSuburbDto())
                 .AsNoTracking()
                 .FirstOrDefaultAsync();
        }

        private static Expression<Func<Suburb, SuburbOverviewSuburbDto>> ToSuburbDto()
        {
            return s => new SuburbOverviewSuburbDto
            {
                Id = s.Id,
                Name = s.Name,
                StateCode = s.State,
                Postcode = s.Postcode
            };
        }

        //2-Metrics Section
        private async Task<SuburbOverviewMetricsDto?> GetMetricsAsync(SuburbOverviewSuburbDto suburb)
        {
            if (suburb == null) return null;
            var suburbId = suburb.Id;             
            var price = await MetricsPrice(suburbId);
            var crime = await MetricsCrime(suburbId);
            var affordability = await MetricsAffordability(suburbId);

            //Keeping value with 2 decimal place only
            if(affordability?.Score is decimal score)
            {
                affordability.Score = decimal.Round(score, 2, MidpointRounding.ToEven);
            }

            //Converting value to %
            decimal? growthPct = price.PriceGrowth3Yr is decimal growth
                ? decimal.Round(growth * 100m, 2, MidpointRounding.ToEven)
                : null;


            return new SuburbOverviewMetricsDto
            {
                MedianPrice = price.MedianPrice,                
                PriceGrowth3YrPct = growthPct,
                Safety = crime,
                Affordability = affordability,
            };

        }

        private async Task<(int? MedianPrice, decimal? PriceGrowth3Yr)> MetricsPrice(int suburbId)
        {
            var data = await _context.HousingMarkets
                .Where(h => h.SuburbId == suburbId)
                .Select(h => new { MedianPrice = (int?)h.MedianPrice, PriceGrowth3Yr = (decimal?)h.PriceGrowth3Yr })
                .AsNoTracking()
                .FirstOrDefaultAsync();
            return data is null ? (null, null) : (data.MedianPrice, data.PriceGrowth3Yr);

        }

        private async Task<SafetyDto?> MetricsCrime(int suburbId)
        {
            var crimeRate = await _context.RiskDevelopments
                .Where(r => r.SuburbId == suburbId)
                .Select(r => (decimal?)r.CrimeRate)                
                .FirstOrDefaultAsync();

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

        private async Task<AffordabilityDto?> MetricsAffordability(int suburbId)
        {
            var affordabilityScore = await _context.SettlyAIScores
                .Where(s => s.SuburbId == suburbId)
                .Select(s => (decimal?)s.AffordabilityScore)
                .FirstOrDefaultAsync();
                if (affordabilityScore is null) return null;

            var affordableLevel = affordabilityScore switch
            {
                <= 3m => "High",
                <= 6m => "Medium",
                _ => "Low"
            };

            return new AffordabilityDto
            {
                Score = affordabilityScore,
                Label = affordableLevel
            };
        }

        //3-Summary Section
        private SuburbOverviewSummaryDto GetSummary(SuburbOverviewMetricsDto metrics, SuburbOverviewSuburbDto suburb)
        {
            string text = string.Empty;
            if (metrics.MedianPrice is int medianPrice &&
                metrics.PriceGrowth3YrPct is decimal priceGrowth3yrPct)
            {
                var millionUnit = 1000000;
                var suburbName = suburb?.Name ?? "This suburb";
                text = $"{suburbName}'s median price is ${medianPrice / millionUnit}M, with {priceGrowth3yrPct}% growth over the past 3 years. Safety is rated High, and affordability is High.";                
            };
             
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
        private IReadOnlyList<string> GetHighlight(SuburbOverviewMetricsDto metrics)
        {
            var highlight = new List<string>();

            var safetyLabel = metrics.Safety?.SafetyLabel;
            if (string.Equals(safetyLabel, "High", StringComparison.OrdinalIgnoreCase))
            {
                highlight.Add("Low Crime");
            }            

            var priceGrowth3yrPct = metrics.PriceGrowth3YrPct;
            const decimal priceGrowthThreshold = 6.0m;
            if (priceGrowth3yrPct is decimal growthRate && growthRate >= priceGrowthThreshold)
            {
                highlight.Add("Strong Growth");
            }


            var affordabilityScore = metrics.Affordability?.Score;
            const decimal affordabilityThreshold = 3.0m;
            if (affordabilityScore is decimal score && score <= affordabilityThreshold)
            {
                highlight.Add("Affordable Choice");
            }

            return highlight;

        }
        #endregion
    }
}
