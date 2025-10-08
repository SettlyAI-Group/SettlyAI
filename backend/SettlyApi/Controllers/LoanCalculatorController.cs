using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SettlyFinance.Calculators.Orchestrators;
using SettlyFinance.Models;
using SettlyModels.DTOs;
using SettlyModels.DTOs.Loan;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanCalculatorController : ControllerBase
    {
        private readonly ILoanCalculatorService _service;
        private readonly ILogger<LoanCalculatorController> _logger;
        public LoanCalculatorController(
         ILoanCalculatorService service,
         ILogger<LoanCalculatorController> logger)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        //[HttpPost("calculate")]
        //[ProducesResponseType(typeof(LoanWrapperDtoResponse), StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        //public ActionResult<LoanWrapperDtoResponse> Calculate(
        //    [FromBody] LoanWrapperDtoRequest request,
        //    CancellationToken ct)
        //{
        //    if (request is null)
        //        return BadRequest(Problem("Request body is required."));
        //    
        //    bool hasAm = request.Amortization is not null;
        //    bool hasPw = request.Piecewise is not null;
        //    if (!(hasAm ^ hasPw))
        //        return BadRequest(Problem("Request must contain exactly one of 'Amortization' or 'Piecewise'."));
        //    if (hasPw && (request.Piecewise!.Segments is null || request.Piecewise.Segments.Count == 0))
        //        return BadRequest(Problem("Piecewise.Segments must contain at least one segment."));
        //    try
        //    {
        //        var resp = _service.Calculate(request);
        //        return Ok(resp);
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        _logger.LogWarning(ex, "Validation failed in LoanCalculatorController.Calculate");
        //        return BadRequest(Problem(ex.Message));
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Unexpected error in LoanCalculatorController.Calculate");
        //        return StatusCode(StatusCodes.Status500InternalServerError, Problem("Internal server error."));
        //    }
        //}
        [HttpPost("single")]
        [ProducesResponseType(typeof(LoanWrapperDtoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public ActionResult<LoanWrapperDtoResponse> CalculateSingle(
            [FromBody] AmortizationRequestDto dto,
            CancellationToken ct)
        {
            if (dto is null)
                return BadRequest(Problem("Request body is required."));
            try
            {
                var wrapper = new LoanWrapperDtoRequest(Amortization: dto, Piecewise: null);
                var resp = _service.Calculate(wrapper);
                return Ok(resp);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation failed in LoanCalculatorController.CalculateSingle");
                return BadRequest(Problem(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in LoanCalculatorController.CalculateSingle");
                return StatusCode(StatusCodes.Status500InternalServerError, Problem("Internal server error."));
            }
        }
        [HttpPost("piecewise")]
        [ProducesResponseType(typeof(LoanWrapperDtoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public ActionResult<LoanWrapperDtoResponse> CalculatePiecewise(
            [FromBody] PiecewiseRequestDto dto,
            CancellationToken ct)
        {
            if (dto is null)
                return BadRequest(Problem("Request body is required."));

            if (dto.Segments is null || dto.Segments.Count == 0)
                return BadRequest(Problem("Piecewise.Segments must contain at least one segment."));
            try
            {
                var wrapper = new LoanWrapperDtoRequest(Amortization: null, Piecewise: dto);
                var resp = _service.Calculate(wrapper);
                return Ok(resp);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation failed in LoanCalculatorController.CalculatePiecewise");
                return BadRequest(Problem(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in LoanCalculatorController.CalculatePiecewise");
                return StatusCode(StatusCodes.Status500InternalServerError, Problem("Internal server error."));
            }
        }
    }
}