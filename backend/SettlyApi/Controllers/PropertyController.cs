using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers

{
    [ApiController]
    [Route("api/properties")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyDetailService _propertyDetailService;

        public PropertyController(IPropertyDetailService propertyDetailService)
        {
            _propertyDetailService = propertyDetailService;

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

            var report = await _propertyDetailService.GeneratePropertyDetailAsync(id);

            return Ok(report);

        }
    }
}
