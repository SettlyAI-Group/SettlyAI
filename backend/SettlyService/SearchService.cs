using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Settly.Dtos;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;
namespace SettlyService
{
    public class SearchService : ISearchService
    {
        private readonly SettlyDbContext _context;
        public SearchService(SettlyDbContext context)
        {
            _context = context;
        }

        #region Function QuerySearchAsync
        public async Task<List<SearchOutputDto>> QuerySearchAsync(string query)
        {
            if (string.IsNullOrEmpty(query) || query.Length < 3)
            {
                return new List<SearchOutputDto>();
            }

            var queryKeywordArray = GetKeywordsArray(query);
            if (!queryKeywordArray.Any())
                return new List<SearchOutputDto>();

            var (postcode, state, searchKeywords) = GetQueryKeywords(queryKeywordArray);
            if (!HasSearchCriteria(postcode, state, searchKeywords))
                return new List<SearchOutputDto>();

            var suburbQ = BuildSuburbQuery(postcode, state, searchKeywords)
                             .AsNoTracking()
                             .OrderBy(s => s.Name);

            var suburbIds = await suburbQ.Select(s => s.Id).ToListAsync();
            if (!suburbIds.Any())
                return new List<SearchOutputDto>();

            var propertyTypes = new[] { "House", "Apartment", "Townhouse", "Unit", "Villa" };
            if (searchKeywords.Any(k => propertyTypes.Contains(k, StringComparer.OrdinalIgnoreCase)))
            {
                var props = await SearchPropertiesAsync(suburbIds, searchKeywords);
                if (props.Any())
                    return props;
            }

            return await SearchSuburbsAsync(suburbQ);
        }
        #endregion

        #region Function GetSuggestionsAsync        
        public async Task<List<SuggestionOutputDto>> GetSuggestionsAsync(string query)
        {
            if (string.IsNullOrEmpty(query) || query.Length < 3)
            {
                return new List<SuggestionOutputDto>();
            }

            var processedQuery = $"{EscapeSqlLikeSymbols(query)}%";

            return await BuildQueryForSql(processedQuery).ToListAsync();
        }
        #endregion


        #region Helper Functions for Function QuerySearchAsync

        private bool PostcodeChecking(string inputToken)
            => inputToken.Length == 4
               && int.TryParse(inputToken, out _);

        private static readonly HashSet<string> _states = new(StringComparer.OrdinalIgnoreCase)
        {
            "NSW","VIC","QLD","WA","SA","TAS","ACT","NT"
        };
        private bool StateChecking(string inputToken)
            => _states.Contains(inputToken);

        private static readonly HashSet<string> _StreetWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "avenue","ave","street","st","road","rd",
            "drive","dr","lane","ln","court","ct",
            "place","pl","way","crescent","cres"
        };
        private bool StreetWordChecking(string inputToken)
            => _StreetWords.Contains(inputToken);

        private string[] GetKeywordsArray(string query)
        {

            var separators = new[] { ' ', ',', '-', '/' };
            return query
                .Split(separators, StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim())
                .Where(t => t.Length >= 2)
                .ToArray();
        }

        private bool HasSearchCriteria(string postcode, string state, List<string> keywords)
            => !string.IsNullOrEmpty(postcode) || !string.IsNullOrEmpty(state) || keywords.Any();

        private (string Postcode, string State, List<string> Keywords) GetQueryKeywords(string[] keywordArray)
        {
            string postcode = "", state = "";
            var remainingKeywords = new List<string>();

            foreach (var keyword in keywordArray)
            {
                if (PostcodeChecking(keyword)) postcode = keyword;
                else if (StateChecking(keyword)) state = keyword.ToUpper();
                else if (!StreetWordChecking(keyword)) remainingKeywords.Add(keyword);
            }

            return (postcode, state, remainingKeywords);
        }

        private string BuildLikePattern(string token)
        {
            var escaped = token
                .Replace("%", "\\%")
                .Replace("_", "\\_");
            return $"%{escaped}%";
        }

        private IQueryable<Suburb> BuildSuburbQuery(
            string postcode,
            string state,
            List<string> searchKeywords)
        {
            var q = _context.Suburbs.AsQueryable();

            if (!string.IsNullOrEmpty(postcode))
                q = q.Where(s => s.Postcode == postcode);

            if (!string.IsNullOrEmpty(state))
                q = q.Where(s => EF.Functions.ILike(s.State, state));

            foreach (var kw in searchKeywords)
            {
                var pat = BuildLikePattern(kw);
                q = q.Where(s => EF.Functions.ILike(s.Name, pat));
            }

            return q;
        }

        private async Task<List<SearchOutputDto>> SearchPropertiesAsync(
            IEnumerable<int> suburbIds,
            List<string> searchKeywords)
        {
            var q = _context.Properties
                .AsNoTracking()
                .Include(p => p.Suburb)
                .Where(p => suburbIds.Contains(p.SuburbId));

            foreach (var kw in searchKeywords)
            {
                var pat = BuildLikePattern(kw);
                q = q.Where(p =>
                    EF.Functions.ILike(p.PropertyType, pat) ||
                    EF.Functions.ILike(p.Address, pat));
            }

            return await q
                .OrderBy(p => p.Price)
                .Select(p => new SearchOutputDto
                {
                    Address = p.Address,
                    PropertyType = p.PropertyType,
                    Price = p.Price,
                    Name = p.Suburb.Name,
                    State = p.Suburb.State,
                    Postcode = p.Suburb.Postcode
                })
                .ToListAsync();
        }

        private Task<List<SearchOutputDto>> SearchSuburbsAsync(IQueryable<Suburb> suburbQ)
            => suburbQ
                .Select(s => new SearchOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                })
                .ToListAsync();
        #endregion

        #region Helper Functions for Function GetSuggestionsAsync
        private string EscapeSqlLikeSymbols(string input)
        {
            return input
                .Replace("%", "\\%")
                .Replace("_", "\\_");
        }

        private IQueryable<SuggestionOutputDto> SuburbNamePatternChecking(string processedQuery)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.Name, processedQuery))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode,
                    SuburbId = s.Id,
                });
        }

        private IQueryable<SuggestionOutputDto> SuburbStatePatternChecking(string processedQuery)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.State, processedQuery))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode,
                    SuburbId = s.Id,
                });
        }

        private IQueryable<SuggestionOutputDto> SuburbStateCodePatternChecking(string processedQuery)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.Postcode, processedQuery))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode,
                    SuburbId = s.Id,
                });
        }

        private IQueryable<SuggestionOutputDto> AddressPatternChecking(string processedQuery)
        {
            return _context.Properties
                .AsNoTracking()
                .Include(p => p.Suburb)
                .Where(p => EF.Functions.ILike(p.Address, processedQuery))
                .Select(p => new SuggestionOutputDto
                {
                    Name = p.Address,
                    State = p.Suburb.State,
                    Postcode = p.Suburb.Postcode,
                    SuburbId = p.SuburbId
                });
        }


        private IQueryable<SuggestionOutputDto> BuildQueryForSql(string pattern)
        {
            var suburbsByName = SuburbNamePatternChecking(pattern);
            var suburbsByState = SuburbStatePatternChecking(pattern);
            var suburbsByStateCode = SuburbStateCodePatternChecking(pattern);
            var propertiesByAddress = AddressPatternChecking(pattern);

            return suburbsByName
                .Union(suburbsByState)
                .Union(suburbsByStateCode)
                .Union(propertiesByAddress)
                .OrderBy(s => s.Name);
        }
        #endregion


    }
}
