using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Settly.Dtos;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

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
        [SwaggerOperation(Summary = "Search based on query")]
        [SwaggerResponse(200, "Successfully retrieved search results", typeof(IEnumerable<SearchOutputDto>))]
        public async Task<ActionResult<IEnumerable<SearchOutputDto>>> GetAsync(SearchInputDto dto)
        {
            var result = await _searchService.QuerySearchAsync(dto.Query);
            return Ok(result);
        }

        [HttpGet("suggest")]
        [SwaggerOperation(Summary = "Get search suggestions")]
        [SwaggerResponse(200, "Successfully retrieved suggestions", typeof(IEnumerable<SuggestionOutputDto>))]
        public async Task<ActionResult<IEnumerable<SuggestionOutputDto>>> SuggestAsync(SuggestionInputDto dto)
        {
            var result = await _searchService.GetSuggestionsAsync(dto.Query);
            return Ok(result);
        }

    }
}
