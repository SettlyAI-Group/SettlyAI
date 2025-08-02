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

        #region Define functions needed to check the user query elements with our Database
        private bool IsPostcode(string inputToken) => (inputToken.Length == 4 && int.TryParse(inputToken, out _));

        private bool IsState(string inputToken)
        {
            var australianStates = new[] { "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT" };
            return australianStates.Contains(inputToken.ToUpper());
        }

        private bool IsCommonWord(string inputToken)
        {
            var commonWords = new[] {
                "avenue", "ave", "street", "st", "road", "rd",
                "drive", "dr", "lane", "ln", "court", "ct",
                "place", "pl", "way", "crescent", "cres"
            };
            return commonWords.Contains(inputToken.ToLower());
        }
        #endregion

        #region Helper Functions
        //Splits the raw query into trimmed tokens of length ≥2, or throws if the query is blank
        private string[] GetInputTokens(string query)
        {
            // Handle empty input
            if (string.IsNullOrWhiteSpace(query))
            {
                throw new ArgumentException("Please provide a suburb name, state, postcode or property.");
            }

            // Split query into inputTokens for searching
            var separators = new char[] { ' ', ',', '-', '/' };
            var inputTokens = query
                .Split(separators, StringSplitOptions.RemoveEmptyEntries)
                .Select(inputToken => inputToken.Trim())
                .Where(inputToken => inputToken.Length >= 2)
                .ToArray();

            return inputTokens;
        }

        //From a list of inputTokens, extract postcode, state, and free-text keywords.
        private (string postcode, string state, List<string> searchKeywords) ExtractSearchKeywords(string[] inputTokens)
        {
            string postcode = "";
            string state = "";
            var searchKeywords = new List<string>();

            foreach (var inputToken in inputTokens)
            {
                if (IsPostcode(inputToken)) postcode = inputToken;
                else if (IsState(inputToken)) state = inputToken.ToUpper();
                else if (!IsCommonWord(inputToken)) searchKeywords.Add(inputToken);
            }
            return (postcode, state, searchKeywords);
        }

        //Escapes SQL wildcards in the token and wraps it with % for an ILIKE pattern.
        private string BuildLikePattern(string token)
        {
            // Escape literal % and _ so they don’t act as wildcards
            var escaped = token
                .Replace("%", "\\%")
                .Replace("_", "\\_");

            // Surround with % to match anywhere in the string
            return $"%{escaped}%";
        }

        //Constructs an IQueryablefor Suburb filtered by postcode, state, and name-keywords
        private IQueryable<Suburb> BuildSuburbQuery(
            string postcode,
            string state,
            List<string> searchKeywords)
        {
            // Start from the full Suburbs set
            var suburbQ = _context.Suburbs.AsQueryable();

            // Filter by postcode if provided
            if (!string.IsNullOrEmpty(postcode))
            {
                suburbQ = suburbQ.Where(s => s.Postcode == postcode);
            }

            // Filter by state if provided
            if (!string.IsNullOrEmpty(state))
            {
                suburbQ = suburbQ.Where(s =>
                    EF.Functions.ILike(s.State, state));
            }

            // For each search keyword, add an ILIKE on the Name
            foreach (var kw in searchKeywords)
            {
                var pattern = BuildLikePattern(kw);
                suburbQ = suburbQ.Where(s =>
                    EF.Functions.ILike(s.Name, pattern));
            }

            return suburbQ;
        }

        //Searches Properties in the given suburbs matching any of the keywords against PropertyType or Address, then projects into DTOs.
        private async Task<List<SearchOutputDto>> SearchPropertiesAsync(IEnumerable<int> suburbIds,List<string> searchKeywords)
        {
            // Start from properties in those suburbs
            var propQ = _context.Properties
                .AsNoTracking()              // read-only
                .Include(p => p.Suburb)
                .Where(p => suburbIds.Contains(p.SuburbId));

            // Apply each keyword as an ILIKE filter on both type and address
            foreach (var inputToken in searchKeywords)
            {
                var pattern = BuildLikePattern(inputToken);
                propQ = propQ.Where(p =>EF.Functions.ILike(p.PropertyType, pattern) ||
                                        EF.Functions.ILike(p.Address, pattern));
            }

            // Execute: order by price, take top 10, project to DTOs
            return await propQ                
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

        //Projects the given suburb query into SearchOutputDto, takes top 10 and materializes.
        private Task<List<SearchOutputDto>> SearchSuburbsAsync(IQueryable<Suburb> suburbQ)
        {
            return suburbQ
                .Take(10)
                .Select(s => new SearchOutputDto
                {
                    Name = s.Name,
                    State = s.State,
                    Postcode = s.Postcode
                })
                .ToListAsync();
        }
        #endregion

        #region Function QuerySearchAsync
        public async Task<List<SearchOutputDto>> QuerySearchAsync(string query)
        {
            //Handle empty input
            if (string.IsNullOrWhiteSpace(query))
            {
                throw new ArgumentException("Please provide a suburb name, state, postcode or property.");
            }


            //Split query into inputTokens for searching
            //var separators = new char[] { ' ', ',', '-', '/' };
            //var inputTokens = query.Split(separators, StringSplitOptions.RemoveEmptyEntries)
            //            .Select(inputToken => inputToken.Trim())
            //            .Where(inputToken => inputToken.Length >= 2)
            //            .ToArray();

            var inputTokens = GetInputTokens(query);

            //No valid inputTokens → empty
            if (!inputTokens.Any()) return new List<SearchOutputDto>();

            //Extract postcode / state / searchKeywords
            //string postcode = "";
            //string state = "";
            //var searchKeywords = new List<string>();

            //foreach (var inputToken in inputTokens)
            //{
            //    if (IsPostcode(inputToken)) postcode = inputToken;
            //    else if (IsState(inputToken)) state = inputToken.ToUpper();
            //    else if (!IsCommonWord(inputToken)) searchKeywords.Add(inputToken);
            //}
            var (postcode, state, searchKeywords) = ExtractSearchKeywords(inputTokens);


            //No valid inputTokens, return empty List
            if (string.IsNullOrEmpty(postcode) && string.IsNullOrEmpty(state) && !searchKeywords.Any())
            {
                return new List<SearchOutputDto>();
            }

            //Build the suburb query for Database
            //var suburbQ = _context.Suburbs.AsQueryable();

            //if (!string.IsNullOrEmpty(postcode))
            //{
            //    suburbQ = suburbQ.Where(s => s.Postcode == postcode);
            //}

            //if (!string.IsNullOrEmpty(state))
            //{
            //    suburbQ = suburbQ.Where(s => EF.Functions
            //                                                .ILike(s.State, state));
            //}

            //if (searchKeywords.Any())
            //{
            //    foreach (var inputToken in searchKeywords)
            //    {
            //        var pattern = $"%{inputToken.Replace("%", "\\%")}%";
            //        suburbQ = suburbQ.Where(s => EF.Functions
            //                                                    .ILike(s.Name, pattern));
            //    }
            //}

            //Build suburb query (uses helper functions)
            var suburbQ = BuildSuburbQuery(postcode, state, searchKeywords)
             .AsNoTracking()
             .OrderBy(s => s.Name);

            //Materialise the matching suburb IDs
            var suburbIds = await suburbQ.Select(s => s.Id).ToListAsync();
            if (!suburbIds.Any()) return new List<SearchOutputDto>();

            //Look for property-type keyword
            var propertyTypes = new[] { "House", "Apartment", "Townhouse", "Unit", "Villa" };
            //if (searchKeywords.Any(t => propertyTypes.Contains(t, StringComparer.OrdinalIgnoreCase)))
            //{
            //    //Porperty serach within those suburbs
            //    var propQ = _context.Properties
            //                        .Include(p => p.Suburb)
            //                        .Where(p => suburbIds
            //                        .Contains(p.SuburbId));

            //    foreach (var inputToken in searchKeywords)
            //    {
            //        var pattern = $"%{inputToken.Replace("%", "\\%")}%";
            //        propQ = propQ.Where(p => EF.Functions.ILike(p.PropertyType, pattern)
            //        ||
            //        EF.Functions.ILike(p.Address, pattern));
            //    }

            //    //Getting result of Properties
            //    var properties = await propQ.Take(10).Select(p => new SearchOutputDto
            //    {
            //        Address = p.Address,
            //        PropertyType = p.PropertyType,
            //        Price = p.Price,
            //        Name = p.Suburb.Name,
            //        State = p.Suburb.State,
            //        Postcode = p.Suburb.Postcode
            //    }).ToListAsync();

            //    if (properties.Any())
            //    {
            //        return properties;
            //    }
            //}
            if (searchKeywords.Any(t => propertyTypes.Contains(t, StringComparer.OrdinalIgnoreCase)))
            {
                var properties = await SearchPropertiesAsync(suburbIds, searchKeywords);
                if (properties.Any())
                {
                    return properties;
                }
            }



            //Return Suburb result, since User query does not have property keywords
            //var suburbs = await suburbQ.Select(s => new SearchOutputDto
            //{
            //    Name = s.Name,
            //    State = s.State,
            //    Postcode = s.Postcode
            //})
            //.Take(10)
            //.ToListAsync();
            //return suburbs;
            return await SearchSuburbsAsync(suburbQ);
        }
        #endregion

        public async Task<BotResponseDto> AskBotAsync(string query)
        {
            return await Task.FromResult(new BotResponseDto
            {
                Response = $"Hello! You asked about: {query}. This chatbot feature is coming soon!",
                Timestamp = DateTime.UtcNow
            });
        }

    }
}
