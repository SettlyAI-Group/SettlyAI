using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;
using SettlyModels.Exceptions;

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
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (RulesetNotFoundException ex)
            {
                return UnprocessableEntity(new { error = ex.Message, versionTag = ex.RequestedVersionTag });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Unexpected error", details = ex.Message });
            }
        }
    }
}
