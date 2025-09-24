using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
