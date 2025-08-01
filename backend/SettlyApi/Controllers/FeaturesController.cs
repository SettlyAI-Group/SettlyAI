using Microsoft.AspNetCore.Mvc;

namespace SettlyApi.Controllers;

/// <summary>
/// Controller for managing application features
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FeaturesController : ControllerBase
{
    private readonly ILogger<FeaturesController> _logger;

    /// <summary>
    /// Initializes a new instance of the FeaturesController
    /// </summary>
    /// <param name="logger">The logger instance for this controller</param>
    public FeaturesController(ILogger<FeaturesController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a list of available application features
    /// </summary>
    /// <returns>A list of feature objects containing id, title, description, and route</returns>
    /// <response code="200">Returns the list of features</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet]
    public ActionResult<IEnumerable<Feature>> Get()
    {
        try
        {
            // Log the request for debugging purposes
            _logger.LogInformation("Features endpoint called");

            // Create a static list of 3 Settly feature objects
            var features = new List<Feature>
            {
                new Feature
                {
                    Id = "settlyhome",
                    Title = "SettlyHome",
                    Description = "Explore smart suburb picks and lifestyle-friendly neighbourhoods.",
                    Route = "/features/settlyhome"
                },
                new Feature
                {
                    Id = "settlyloan",
                    Title = "SettlyLoan",
                    Description = "Compare fixed vs variable, estimate repayments, and beat loan stress.",
                    Route = "/features/settlyloan"
                },
                new Feature
                {
                    Id = "settlysuper",
                    Title = "SettlySuper",
                    Description = "Use your Super Wisely to Boost Your Home Plan.",
                    Route = "/features/settlysuper"
                }
            };

            // Log successful response
            _logger.LogInformation("Successfully retrieved {Count} features", features.Count);

            // Return the features as JSON with 200 status code
            return Ok(features);
        }
        catch (Exception ex)
        {
            // Log the exception for debugging
            _logger.LogError(ex, "Error occurred while retrieving features");

            // Return 500 Internal Server Error
            return StatusCode(500, new { error = "An internal server error occurred while retrieving features" });
        }
    }
}

/// <summary>
/// Represents an application feature
/// </summary>
public class Feature
{
    /// <summary>
    /// Unique identifier for the feature
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Display name of the feature
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description of the feature
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Route path for accessing the feature
    /// </summary>
    public string Route { get; set; } = string.Empty;
} 