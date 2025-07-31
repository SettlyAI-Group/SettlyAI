using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyApi.DTOs;
using SettlyModels;
namespace SettlyService
{
    public class SearchApiService : ISearchApiService
    {
        private readonly SettlyDbContext _context;

        public SearchApiService(SettlyDbContext context)
        {
            _context = context;
        }

        #region Define functions needed to check the user query elements with our Database
        private bool IsPostcode(string term) => (term.Length == 4 && int.TryParse(term, out _));

        private bool IsState(string term)
        {
            var australianStates = new[] { "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT" };
            return australianStates.Contains(term.ToUpper());
        }

        private bool isCommonWord(string term)
        {
            var commonWords = new[] {
                "avenue", "ave", "street", "st", "road", "rd",
                "drive", "dr", "lane", "ln", "court", "ct",
                "place", "pl", "way", "crescent", "cres"
            };
            return commonWords.Contains(term.ToLower());
        }
        #endregion

        public async Task<List<SearchOutputDto>> QuerySearch(string query)
        {
            #region Handle empty input
            if (string.IsNullOrWhiteSpace(query)) return new List<SearchOutputDto>();
            #endregion


            #region Split query into differents terms for searching in the next step
            var separators = new char[] { ' ', ',', '-', '/' };
            var terms = query.Split(separators, StringSplitOptions.RemoveEmptyEntries)
                        .Select(term => term.Trim())
                        .Where(term => term.Length >= 2)
                        .ToArray();
            #endregion


            #region Handle query no matching with our Database
            if (!terms.Any()) return new List<SearchOutputDto>();
            #endregion

            #region Extracted the useful terms that matches our data in Database
            string postcode = "";
            string state = "";
            var nameTerms = new List<string>();

            foreach (var term in terms)
            {
                if (IsPostcode(term)) postcode = term;
                else if (IsState(term)) state = term.ToUpper();
                else if (!isCommonWord(term)) nameTerms.Add(term);
            }
            #endregion

            //If there is no valid Postcode, State or Suburb Name, return empty List
            if (string.IsNullOrEmpty(postcode) && string.IsNullOrEmpty(state) && !nameTerms.Any())
            {
                return new List<SearchOutputDto>();
            }

            #region Build the Database query for Database searching
            var queryBuilder = _context.Suburbs.AsQueryable();

            if (!string.IsNullOrEmpty(postcode))
            {
                queryBuilder = queryBuilder.Where(table => table.Postcode == postcode);
            }

            if (!string.IsNullOrEmpty(state))
            {
                queryBuilder = queryBuilder.Where(table => EF.Functions
                                                            .ILike(table.State, state));
            }

            if (nameTerms.Any())
            {
                foreach (var term in nameTerms)
                {
                    var termPattern = $"%{term.Replace("%", "\\%")}%";
                    queryBuilder = queryBuilder.Where(table => EF.Functions
                                                                .ILike(table.Name, termPattern));
                }

                
            }
            #endregion

            //Execute the Database query and return result
            var result = await queryBuilder.Select(table => new SearchOutputDto
            {
                Name = table.Name,
                State = table.State,
                Postcode = table.Postcode
            })
            .Take(10)
            .ToListAsync();

            return result;
        }

        public async Task<BotResponseDto> AskBot(string query)
        {
            return await Task.FromResult(new BotResponseDto
            {
                Response = $"Hello! You asked about: {query}. This chatbot feature is coming soon!",
                Timestamp = DateTime.UtcNow
            });
        }

    }
}
