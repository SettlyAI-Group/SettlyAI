using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Settly.DTOs;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchApiService)
        {
            _searchService = searchApiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SearchOutputDto>>> GetAsync(SearchInputDto dto)
        {
            var result = await _searchService.QuerySearchAsync(dto.Query);
            return Ok(result);
        }

        [HttpGet("chat")]
        public async Task<ActionResult<BotOutputDto>> Chat(BotInputDto input)
        {
            var reply = await _searchService.AskBotAsync(input.Intent);
            return Ok(reply);
        }

    }
}
