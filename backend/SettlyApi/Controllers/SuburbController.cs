using SettlyModels;
using Microsoft.AspNetCore.Mvc;

using ISettlyService;
using SettlyModels.Dtos;

namespace SettlyApi.Controllers

{
    [ApiController]
    [Route("api/suburb")]
    public class SuburbController : ControllerBase
    {
        private readonly ISuburbReportService _suburbReportService;

        public SuburbController(ISuburbReportService suburbReportService)
        {
            _suburbReportService = suburbReportService;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuburbReportDto>> GetSuburbReport(int id)
        {

            var report = await _suburbReportService.GenerateSuburbReportAsync(id);
            return Ok(report);

        }
    }
}