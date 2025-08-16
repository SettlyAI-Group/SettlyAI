using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ISettlyService; // Add the correct namespace for ISuburbService
using SettlyModels.Dtos.Suburb;

namespace SettlyApi.Controllers
{
  [ApiController]
  [Route("api/suburbs/{suburbId}/[controller]")]
  public class SafetyScoresController : ControllerBase
  {
    private readonly ISuburbService _suburbService;
    private readonly ILogger<SafetyScoresController> _logger;

    public SafetyScoresController(
        ISuburbService suburbService,
        ILogger<SafetyScoresController> logger)
    {
      _suburbService = suburbService;
      _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<SafetyScoreOutputDto>> GetSafetyScores(int suburbId)
    {
      try
      {
        var result = await _suburbService.GetSafetyScoresAsync(suburbId);

        if (result == null)
          return NotFound($"Safety scores data not found for suburb {suburbId}");

        return Ok(result);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Errors occur when fetching safety scores by {SuburbId}", suburbId);
        return StatusCode(500, "An error occurred while retrieving safety scores data");
      }
    }
  }
}
