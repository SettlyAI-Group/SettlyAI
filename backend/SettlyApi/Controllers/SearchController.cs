using Bogus.DataSets;
using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SettlyApi.DTOs;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchApiService;

        public SearchController(ISearchService searchApiService)
        {
            _searchApiService = searchApiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SearchOutputDto>>> GetAsync(
            [FromQuery(Name = "q")] string query)
        {
            try
            {
                var result = await _searchApiService.QuerySearchAsync(query);
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
                var reply = await _searchApiService.AskBotAsync(query);
                return Ok(reply);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
