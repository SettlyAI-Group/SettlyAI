using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PopulationSupplyController : ControllerBase
    {
        private readonly IPopulationSupplyService _populationSupplyService;
        public PopulationSupplyController(IPopulationSupplyService populationSupplyService)
        {
            _populationSupplyService = populationSupplyService;
        }

        [HttpGet("{suburbId}")]
        [SwaggerOperation(Summary = "Get population supply data for a suburb")]
        [SwaggerResponse(200, "Successfully retrieved population data", typeof(PopulationSupplyDto))]
        [SwaggerResponse(404, "Suburb not found")]
        public async Task<ActionResult<PopulationSupplyDto>> Get(int suburbId)
        {
            try
            {
                var populationSupplyDto = await _populationSupplyService.GetPopulationSupplyDataAsync(suburbId);
                return Ok(populationSupplyDto);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}
