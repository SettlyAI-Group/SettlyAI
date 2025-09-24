using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SettlyFinance.Calculators.Orchestrators;
using SettlyFinance.Models;
using SettlyModels.DTOs.Loan;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanCalculatorController : ControllerBase
    {
        private readonly ILoanCalculatorService _service;
        public LoanCalculatorController(ILoanCalculatorService service) => _service = service;
        // <summary>
        /// Calculate amortization schedule or summary for a loan.
        /// </summary>
        [HttpPost("calculate")]
        [ProducesResponseType(typeof(AmortizationResponseDto), 200)]
        public ActionResult<AmortizationResponseDto> Calculate([FromBody] AmortizationRequestDto dto)
        {
            var response = _service.Calculate(dto);
            return Ok(response);
        }
        [HttpPost("calculate/piecewise")]
        [ProducesResponseType(typeof(PiecewiseResult), 200)]
        public ActionResult<PiecewiseResult> CalculatePiecewise([FromBody] PiecewiseRequestDto dto, [FromServices] LoanCalculatorFacade facade)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var input = new PiecewiseInput(
                InitialLoanAmount: dto.InitialLoanAmount,
                GenerateSchedule: dto.GenerateSchedule,
                Segments: dto.Segments.ConvertAll(s => new PiecewiseSegmentInput(
                    Type: s.Type,
                    AnnualInterestRate: s.AnnualInterestRate,
                    TermPeriods: s.TermPeriods,
                    Frequency: s.Frequency,
                    GenerateSchedule: s.GenerateSchedule,
                    Label: s.Label
                ))
            );
            var result = facade.CalculatePiecewise(input);
            return Ok(result);
        }
    }
}
