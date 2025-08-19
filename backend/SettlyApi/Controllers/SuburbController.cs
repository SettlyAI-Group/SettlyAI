using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

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
        [SwaggerOperation(Summary = "Get suburb by ID", Description = "Returns the suburb's latest details for the given ID.")]
        [SwaggerResponse(200, "Successfully returned suburb details", typeof(SuburbDto))]
        [SwaggerResponse(404, "Suburb not found")]
        public async Task<ActionResult<SuburbDto>> GetById([SwaggerParameter("The unique ID of the suburb")] int id)
        {
            var suburb = await _suburbService.GetSuburbsByIdAsync(id);
            return Ok(suburb);
        }

        [HttpGet("income")]
        [SwaggerOperation(Summary = "Get suburb income & employment data", Description = "Returns the suburb's latest income and employment data for the given ID.")]
        [SwaggerResponse(200, "Successfully returned suburb income & employment data", typeof(IncomeEmploymentDto))]
        public async Task<ActionResult<IncomeEmploymentDto>> GetIncome(int id)
        {
            var incomeEmploymentDto = await _suburbService.GetIncomeAsync(id);
            return Ok(incomeEmploymentDto);
        }

        [HttpGet("market")]
        [SwaggerOperation(Summary = "Get suburb housing market data", Description = "Returns the suburb's latest housing markets data for the given ID.")]
        public async Task<ActionResult> GetMarket(int id)
        {
            return Ok();
        }

        [SwaggerOperation(Summary = "Get suburb demand and development data", Description = "Returns the suburb's latest demand and development data for the given ID.")]
        [HttpGet("demand-development")]
        public async Task<ActionResult> GetDemandDev(int id)
        {
            return Ok();
        }

        [HttpGet("livability")]
        [SwaggerOperation(Summary = "Get suburb livability data", Description = "Returns the suburb's latest livability data for the given ID.")]
        [SwaggerResponse(200, "Successfully returned livability data", typeof(LivabilityDto))]
        public async Task<ActionResult<LivabilityDto>> GetLivability(int id)
        {
            var liveStyle = await _suburbService.GetLivabilityAsync(id);
            return Ok(liveStyle);
        }

        [HttpGet("safety")]
        [SwaggerOperation(Summary = "Get suburb safety", Description = "Returns the suburb's latest livability data for the given ID.")]
        public async Task<ActionResult> GetSafety(int id)
        {
            return Ok();
        }

        [HttpGet("snapshot")]
        public async Task<ActionResult<SuburbSnapshotDto>> GetSnapshot(int id)
        {
            var snapshot = await _suburbService.GetSnapshotAsync(id);
            return Ok(snapshot);
        }
    }
}
