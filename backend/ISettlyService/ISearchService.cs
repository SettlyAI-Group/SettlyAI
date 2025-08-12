using Settly.DTOs;
using SettlyModels.DTOs;

namespace ISettlyService
{
    public interface ISearchService
    {
        public Task<List<SearchOutputDto>> QuerySearchAsync(string query);

        public Task<List<SuggestionOutputDto>> GetSuggestionsAsync(string query);


        public Task<BotOutputDto> AskBotAsync(string query);
    }
}
