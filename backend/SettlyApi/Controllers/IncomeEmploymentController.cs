using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeEmploymentController : ControllerBase
    {
        private readonly IIncomeEmploymentService _incomeEmploymentService;

        public IncomeEmploymentController(IIncomeEmploymentService incomeEmploymentServiceservice)
        {
            _incomeEmploymentService = incomeEmploymentServiceservice;
        }

        [HttpGet("{suburbId}")]
        public async Task<ActionResult<IncomeEmploymentDto>> Get(int suburbId)
        {
            try
            {
                var incomeEmploymentDto = await _incomeEmploymentService.GetIncomeEmploymentDataAsync(suburbId);
                return Ok(incomeEmploymentDto);
            }
            catch
            {
                return NotFound();
            }
        }
    }
}
