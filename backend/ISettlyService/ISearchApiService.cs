using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyApi;
using SettlyApi.DTOs;

namespace ISettlyService
{
    public interface ISearchApiService
    {
        public Task<List<SearchOutputDto>> QuerySearchAsync(string query);

        public Task<BotResponseDto> AskBotAsync(string query);
    }
}
