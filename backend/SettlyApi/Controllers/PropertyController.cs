using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SettlyApi.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;

        }

        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Get property details",
            Description = "Returns the full PropertyDetailDto for a given property ID."
        )]
        [SwaggerResponse(200, "Successfully returned property details", typeof(PropertyDetailDto))]
        [SwaggerResponse(404, "Property not found")]
        public async Task<ActionResult<PropertyDetailDto>> GetPropertyDetail([SwaggerParameter("The unique ID of the property")] int id)
        {
            var result = await _propertyService.GeneratePropertyDetailAsync(id);

            return Ok(result);
        }

        [HttpGet("{id}/similar")]
        public async Task<ActionResult<List<PropertyRecommendationDto>>> GetPropertyRecommendation(int id)
        {
            var result = await _propertyService.GetSimilarPropertiesAsync(id);
            return Ok(result);
        }

        [HttpGet("{id}/inspection-times")]
        [SwaggerOperation(
            Summary = "Get inspection time options",
            Description = "Returns available inspection time options for a given property."
        )]
        [SwaggerResponse(200, "Successfully returned available inspection times", typeof(List<DateTime>))]
        [SwaggerResponse(404, "Property not found")]
        public async Task<ActionResult<List<DateTime>>> GetInspectionTimes(int id)
        {
            var result = await _propertyService.GetInspectionTimeOptionsAsync(id);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("{id}/inspection-plans")]
        public async Task<ActionResult<InspectionPlanDto>> CreateInspectionPlan(int id, [FromBody] CreateInspectionPlanRequest request)
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var result = await _propertyService.CreateInspectionPlanAsync(id, userId, request.SelectedTime, request.Note);
            return Ok(result);
        }

    }

}

public class CreateInspectionPlanRequest
{
    public DateTime SelectedTime { get; set; }
    public string Note { get; set; } = string.Empty;
}
