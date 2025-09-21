using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/fees/vic-transfer")]
    public class TransferFeeController : ControllerBase
    {
        private readonly ITransferFeeService _service;
        public TransferFeeController(ITransferFeeService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult Calculate([FromBody] TransferFeeRequestDto request)
        {
            if (request == null || request.DutiableValue <= 0)
            {
                return BadRequest(new { error = "dutiableValue must be a positive number" });
            }

            try
            {
                var resp = _service.CalculateFee(request);
                return Ok(resp);
            }
            catch (InvalidOperationException ex) when (ex.Message == "ruleset not available")
            {
                return UnprocessableEntity(new { error = "ruleset not available" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
