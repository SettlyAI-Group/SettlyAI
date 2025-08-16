using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels;
using SettlyModels.Dtos;

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
        public async Task<ActionResult<PropertyDetailDto>> GetPropertyDetail(int id)
        {

            var report = await _propertyDetailService.GeneratePropertyDetailAsync(id);

            return Ok(report);

        }
    }
}
