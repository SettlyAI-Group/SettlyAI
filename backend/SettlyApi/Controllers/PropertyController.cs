using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;

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
        public async Task<ActionResult<PropertyDetailDto>> GetPropertyDetail(int id)
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
