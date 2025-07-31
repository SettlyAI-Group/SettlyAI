using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyApi;
using SettlyApi.DTOs;

namespace ISettlyService
{
    public interface ISearchApi
    {
        public Task<List<SearchOutputDto>> QuerySearch(string query);

        public Task<BotResponseDto> AskBot(string query);
    }
}
