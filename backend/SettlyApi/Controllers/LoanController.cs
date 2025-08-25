using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;

        }

        [HttpPost("simulate")]
        [SwaggerOperation(
            Summary = "Calculate Loan",
            Description = "Returns the loan details for a given input."
        )]
        [SwaggerResponse(200, "Successfully returned loan details", typeof(LoanSimulateOutputDto))]

        public async Task<ActionResult<LoanSimulateOutputDto>> GetLoanSimulate([SwaggerParameter("loan simulate input")] LoanSimulateInputDto input)
        {
            var result = await _loanService.GenerateLoanSimulateDtoAsync(input);

            return Ok(result);
        }

    
    }
}
