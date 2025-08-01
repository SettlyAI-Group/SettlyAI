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
        public async Task<ActionResult<IEnumerable<SearchOutputDto>>> GetAsync(
            [FromQuery] SearchRequestDto dto)
        {
            try
            {
                var result = await _searchService.QuerySearchAsync(dto.Query);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }

        [HttpGet("chat")]
        public async Task<ActionResult<BotResponseDto>> Chat(
            [FromQuery(Name = "intent")] string query = "start"
            )
        {
            try
            {
                var reply = await _searchService.AskBotAsync(query);
                return Ok(reply);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
