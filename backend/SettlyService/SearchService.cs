using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Settly.DTOs;
using SettlyModels;
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
            // 1. Validate raw input from user, throw error with empty input
            if (string.IsNullOrWhiteSpace(query))
                throw new ArgumentException("Please provide a suburb name, state, postcode or property address.");

            // 2. Tokenize & filter out trivial terms
            var inputTokens = GetInputTokens(query);
            if (!inputTokens.Any())
                return new List<SearchOutputDto>();

            // 3. Parse postcode, state & remaining keywords, return empty list if nothing match with our Database
            var (postcode, state, searchKeywords) = ExtractSearchKeywords(inputTokens);
            if (!HasSearchCriteria(postcode, state, searchKeywords))
                return new List<SearchOutputDto>();

            // 4. Build and refine the Suburb query for Database
            var suburbQ = BuildSuburbQuery(postcode, state, searchKeywords)
                             .AsNoTracking()
                             .OrderBy(s => s.Name);

            // 5. Execute to get matching suburb IDs in our Suburb table
            var suburbIds = await suburbQ.Select(s => s.Id).ToListAsync();
            if (!suburbIds.Any())
                return new List<SearchOutputDto>();

            // 6. If any keyword is a property type, attempt a Property search using suburb IDs we obtained in step 5.
            var propertyTypes = new[] { "House", "Apartment", "Townhouse", "Unit", "Villa" };
            if (searchKeywords.Any(k => propertyTypes.Contains(k, StringComparer.OrdinalIgnoreCase)))
            {
                var props = await SearchPropertiesAsync(suburbIds, searchKeywords);
                if (props.Any())
                    return props;
            }

            // 7. Fallback: return Suburb-only results if no keyword matches with Properties table
            return await SearchSuburbsAsync(suburbQ);
        }
        #endregion

        public async Task<BotOutputDto> AskBotAsync(string query)
        {
            return await Task.FromResult(new BotOutputDto
            {
                Response = $"Hello! You asked about: {query}. This chatbot feature is coming soon!",
                Timestamp = DateTime.UtcNow
            });
        }

        #region Helper Functions for Function QuerySearchAsync

        // 1) Australian postcode: exactly 4 numeric digits
        private bool IsPostcode(string inputToken)
            => inputToken.Length == 4
               && int.TryParse(inputToken, out _);

        // 2) Australian state code (NSW, VIC, QLD, etc.)
        private static readonly HashSet<string> _states = new(StringComparer.OrdinalIgnoreCase)
        {
            "NSW","VIC","QLD","WA","SA","TAS","ACT","NT"
        };
        private bool IsState(string inputToken)
            => _states.Contains(inputToken);

        // 3) Common address terms to ignore (ave, st, rd, etc.)
        private static readonly HashSet<string> _commonWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "avenue","ave","street","st","road","rd",
            "drive","dr","lane","ln","court","ct",
            "place","pl","way","crescent","cres"
        };
        private bool IsCommonWord(string inputToken)
            => _commonWords.Contains(inputToken);

        // 4) Tokenize & clean
        //    Split raw query by common separators, trim, drop <2-char tokens.
        private string[] GetInputTokens(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                throw new ArgumentException("Please provide a suburb name, state, postcode or property.");

            var separators = new[] { ' ', ',', '-', '/' };
            return query
                .Split(separators, StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim())
                .Where(t => t.Length >= 2)
                .ToArray();
        }

        // 5) Returns true if the user supplied at least one search criterion (postcode, state, or free-text keywords).

        private bool HasSearchCriteria(string postcode, string state, List<string> keywords)
            => !string.IsNullOrEmpty(postcode) || !string.IsNullOrEmpty(state) || keywords.Any();

        // 6) Classify tokens
        //    Extract postcode, state; collect everything else as keywords.
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

        // 7) Build ILIKE pattern
        //    Escape SQL wildcards, then wrap in % for a contains-style search.
        private string BuildLikePattern(string token)
        {
            var escaped = token
                .Replace("%", "\\%")
                .Replace("_", "\\_");
            return $"%{escaped}%";
        }

        // 8) Build Suburb query
        //    Apply postcode, state and name-keyword filters to Suburbs set.
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

        // 9) Search Properties
        //    In the given suburb IDs, filter properties by type/address keywords,
        //    then project top 10 by price into DTOs.
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
                .Take(10)
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

        // 10) Search Suburbs
        //    Project the Suburb query into DTOs and return top 10.
        private Task<List<SearchOutputDto>> SearchSuburbsAsync(IQueryable<Suburb> suburbQ)
            => suburbQ
                .Take(10)
                .Select(s => new SearchOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                })
                .ToListAsync();
        #endregion

    }
}
