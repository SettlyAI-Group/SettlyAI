using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyApi.Controllers

{
    [ApiController]
    [Route("api/[controller]/{id:int}")]
    public class SuburbController : ControllerBase
    {
        private readonly ISuburbService _suburbService;

        public SuburbController(ISuburbService suburbService)
        {
            _suburbService = suburbService;

        }

        [HttpGet]
        public async Task<ActionResult<SuburbDto>> GetById(int id)
        {
            var suburb = await _suburbService.GetSuburbsByIdAsync(id);
            return Ok(suburb);
        }

        [HttpGet("income")]
        public async Task<ActionResult> GetIncome(int id)
        {
            return Ok();
        }

        [HttpGet("market")]
        public async Task<ActionResult> GetMarket(int id)
        {
            return Ok();
        }

        [HttpGet("demand-development")]
        public async Task<ActionResult> GetDemandDev(int id)
        {
            return Ok();
        }

        [HttpGet("livability")]
        public async Task<ActionResult<LivabilityDto>> GetLivability(int id)
        {
            var liveStyle = await _suburbService.GetLivabilityAsync(id);
            return Ok(liveStyle);
        }

        [HttpGet("safety")]
        public async Task<ActionResult> GetSafety(int id)
        {
            return Ok();
        }
    }
}
