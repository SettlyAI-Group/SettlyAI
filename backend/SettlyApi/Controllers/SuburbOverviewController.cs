using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;


namespace SettlyApi.Controllers
{
    [Route("api/suburbs")]
    [ApiController]
    public class SuburbOverviewController : ControllerBase
    {
        private readonly ISuburbOverviewService _suburbOverviewService;

        public SuburbOverviewController(ISuburbOverviewService suburbOverviewService)
        {
            _suburbOverviewService = suburbOverviewService;
        }

        [HttpGet("overview")]
        [SwaggerOperation(Summary = "Suburb overview based on user clkcing the map")]
        [SwaggerResponse(200, "Successfully retrieved suburb overview result", typeof(SuburbOverviewDto))]
        public async Task<ActionResult<SuburbOverviewDto>> GetAsync([FromQuery] MapInputDto input)
        {
            var result = await _suburbOverviewService.GetSuburbOverviewAsync(input);
            return Ok(result);
        }

    }



    }

