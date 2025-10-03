using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;
using System;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/super")]
    public class SuperEstimateController : ControllerBase
    {
        private readonly IFhssService _fhssService;
        private readonly IProjectionService _projectionService;

        public SuperEstimateController(
            IFhssService fhssService,
            IProjectionService projectionService)
        {
            _fhssService = fhssService;
            _projectionService = projectionService;
        }

        /// <summary>
        /// Estimate superannuation projection with/without FHSS withdrawal.
        /// </summary>
        [HttpPost("estimate")]
        [ProducesResponseType(typeof(SuperEstimateResponseDto), 200)]
        [ProducesResponseType(400)]
        public ActionResult<SuperEstimateResponseDto> Estimate([FromBody] SuperEstimateRequestDto request)
        {
            try
            {
                if (request.TargetAge <= request.Age)
                {
                    return BadRequest("TargetAge must be greater than Age");
                }

                if (request.Balance < 0)
                {
                    return BadRequest("Balance cannot be negative");
                }

                if (request.AnnualIncome < 0)
                {
                    return BadRequest("AnnualIncome cannot be negative");
                }

                // Without FHSS
                var withoutFhss = _projectionService.ProjectWithoutFhss(request);

                // With FHSS (only if selected + valid)
                decimal? fhssAmount = null;
                if (request.FhssSelected && request.FhssAmount.HasValue)
                {
                    fhssAmount = _fhssService.ProcessFhssAmount(request);
                }

                var response = new SuperEstimateResponseDto
                {
                    WithoutFhss = withoutFhss
                };

                if (fhssAmount.HasValue && fhssAmount.Value > 0)
                {
                    var withFhss = _projectionService.ProjectWithFhss(request, fhssAmount.Value);
                    response.WithFhss = withFhss;

                    decimal finalWithout = withoutFhss[^1].Balance;
                    decimal finalWith = withFhss[^1].Balance;
                    response.NetDifference = finalWith - finalWithout;
                }

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    errors = new { fhssAmount = ex.Message }
                });
            }
        }
    }
}
