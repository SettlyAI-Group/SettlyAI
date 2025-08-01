using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Settly.DTOs;
using SettlyModels;
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

        #region Function QuerySearchAsync
        public async Task<List<SearchOutputDto>> QuerySearchAsync(string query)
        {
            //Handle empty input
            if (string.IsNullOrWhiteSpace(query))
            {
                throw new ArgumentException("Please provide a suburb name, state, postcode or property.");
            }


            //Split query into inputTokens for searching
            var separators = new char[] { ' ', ',', '-', '/' };
            var inputTokens = query.Split(separators, StringSplitOptions.RemoveEmptyEntries)
                        .Select(inputToken => inputToken.Trim())
                        .Where(inputToken => inputToken.Length >= 2)
                        .ToArray();

            //No valid inputTokens → empty
            if (!inputTokens.Any()) return new List<SearchOutputDto>();

            //Extract postcode / state / searchKeywords
            string postcode = "";
            string state = "";
            var searchKeywords = new List<string>();

            foreach (var inputToken in inputTokens)
            {
                if (IsPostcode(inputToken)) postcode = inputToken;
                else if (IsState(inputToken)) state = inputToken.ToUpper();
                else if (!IsCommonWord(inputToken)) searchKeywords.Add(inputToken);
            }

            //No valid inputTokens, return empty List
            if (string.IsNullOrEmpty(postcode) && string.IsNullOrEmpty(state) && !searchKeywords.Any())
            {
                return new List<SearchOutputDto>();
            }

            //Build the suburb query for Database
            var suburbQ = _context.Suburbs.AsQueryable();

            if (!string.IsNullOrEmpty(postcode))
            {
                suburbQ = suburbQ.Where(s => s.Postcode == postcode);
            }

            if (!string.IsNullOrEmpty(state))
            {
                suburbQ = suburbQ.Where(s => EF.Functions
                                                            .ILike(s.State, state));
            }

            if (searchKeywords.Any())
            {
                foreach (var inputToken in searchKeywords)
                {
                    var pattern = $"%{inputToken.Replace("%", "\\%")}%";
                    suburbQ = suburbQ.Where(s => EF.Functions
                                                                .ILike(s.Name, pattern));
                }
            }

            //Materialise the matching suburb IDs
            var suburbIds = await suburbQ.Select(s => s.Id).ToListAsync();
            if(!suburbIds.Any()) return new List<SearchOutputDto>();

            //Look for property-type keyword
            var propertyTypes = new[] { "House", "Apartment", "Townhouse", "Unit", "Villa" };
            if(searchKeywords.Any(t => propertyTypes.Contains(t, StringComparer.OrdinalIgnoreCase)))
            {
                //Porperty serach within those suburbs
                var propQ = _context.Properties
                                    .Include(p => p.Suburb)
                                    .Where(p => suburbIds
                                    .Contains(p.SuburbId));

                foreach(var inputToken in searchKeywords)
                {
                    var pattern = $"%{inputToken.Replace("%", "\\%")}%";
                    propQ = propQ.Where(p => EF.Functions.ILike(p.PropertyType, pattern)
                    ||
                    EF.Functions.ILike(p.Address, pattern));
                }

                //Getting result of Properties
                var properties = await propQ.Take(10).Select(p => new SearchOutputDto
                {
                    Address = p.Address,
                    PropertyType = p.PropertyType,
                    Price = p.Price,
                    Name = p.Suburb.Name,
                    State = p.Suburb.State,
                    Postcode = p.Suburb.Postcode
                }).ToListAsync();

                if (properties.Any())
                {
                    return properties;
                }
            }

   

            //Return Suburb result, since User query does not have property keywords
            var suburbs = await suburbQ.Select(s => new SearchOutputDto
            {
                Name = s.Name,
                State = s.State,
                Postcode = s.Postcode
            })
            .Take(10)
            .ToListAsync();
            return suburbs;
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
