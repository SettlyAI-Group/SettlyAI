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

            var inputTokens = GetInputTokens(query);
            if (!inputTokens.Any())
                return new List<SearchOutputDto>();

            var (postcode, state, searchKeywords) = ExtractSearchKeywords(inputTokens);
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

            var pattern = $"{EscapeForLike(query)}%";

            return await BuildCombinedSuggestionQuery(pattern).ToListAsync();
        }
        #endregion

        #region Function AskBotAsync
        public async Task<BotOutputDto> AskBotAsync(string query)
        {
            return await Task.FromResult(new BotOutputDto
            {
                Response = $"Hello! You asked about: {query}. This chatbot feature is coming soon!",
                Timestamp = DateTime.UtcNow
            });
        }
        #endregion

        #region Helper Functions for Function QuerySearchAsync

        private bool IsPostcode(string inputToken)
            => inputToken.Length == 4
               && int.TryParse(inputToken, out _);

        private static readonly HashSet<string> _states = new(StringComparer.OrdinalIgnoreCase)
        {
            "NSW","VIC","QLD","WA","SA","TAS","ACT","NT"
        };
        private bool IsState(string inputToken)
            => _states.Contains(inputToken);

        private static readonly HashSet<string> _commonWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "avenue","ave","street","st","road","rd",
            "drive","dr","lane","ln","court","ct",
            "place","pl","way","crescent","cres"
        };
        private bool IsCommonWord(string inputToken)
            => _commonWords.Contains(inputToken);

        private string[] GetInputTokens(string query)
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

        private (string Postcode, string State, List<string> Keywords) ExtractSearchKeywords(string[] tokens)
        {
            string postcode = "", state = "";
            var keywords = new List<string>();

            foreach (var t in tokens)
            {
                if (IsPostcode(t)) postcode = t;
                else if (IsState(t)) state = t.ToUpper();
                else if (!IsCommonWord(t)) keywords.Add(t);
            }

            return (postcode, state, keywords);
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
        private string EscapeForLike(string input)
        {
            return input
                .Replace("%", "\\%")
                .Replace("_", "\\_");
        }

        private IQueryable<SuggestionOutputDto> SuggestBySuburbNamePattern(string pattern)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.Name, pattern))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                });
        }

        private IQueryable<SuggestionOutputDto> SuggestBySuburbStatePattern(string pattern)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.State, pattern))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                });
        }

        private IQueryable<SuggestionOutputDto> SuggestBySuburbStateCodePattern(string pattern)
        {
            return _context.Suburbs
                .AsNoTracking()
                .Where(s => EF.Functions.ILike(s.Postcode, pattern))
                .Select(s => new SuggestionOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                });
        }

        private IQueryable<SuggestionOutputDto> SuggestByPropertyAddressPattern(string pattern)
        {
            return _context.Properties
                .AsNoTracking()
                .Include(p => p.Suburb)
                .Where(p => EF.Functions.ILike(p.Address, pattern))
                .Select(p => new SuggestionOutputDto
                {
                    Name = p.Address,
                    State = p.Suburb.State,
                    Postcode = p.Suburb.Postcode
                });
        }


        private IQueryable<SuggestionOutputDto> BuildCombinedSuggestionQuery(string pattern)
        {
            var suburbsByName = SuggestBySuburbNamePattern(pattern);
            var suburbsByState = SuggestBySuburbStatePattern(pattern);
            var suburbsByStateCode = SuggestBySuburbStateCodePattern(pattern);
            var propertiesByAddress = SuggestByPropertyAddressPattern(pattern);

            return suburbsByName
                .Union(suburbsByState)
                .Union(suburbsByStateCode)
                .Union(propertiesByAddress)
                .OrderBy(s => s.Name);
        }
        #endregion


    }
}
