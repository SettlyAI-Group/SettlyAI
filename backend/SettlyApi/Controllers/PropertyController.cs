using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

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
        public async Task<ActionResult<List<PropertyRecommendationDto>>>GetPropertyRecommendation(int id)
        {
            var result = await _propertyService.GetSimilarPropertiesAsync(id);
            return Ok(result);
        }
    }
}
