using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;

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
