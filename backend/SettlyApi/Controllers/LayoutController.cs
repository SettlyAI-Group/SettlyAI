using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;

namespace SettlyApi.Controllers
{
    [Route("api/[layout]")]
    [ApiController]
    public class LayoutController : ControllerBase
    {
        private readonly ILayoutNavService _layoutNavService;

        public LayoutController(ILayoutNavService layoutNavService)
        {
            _layoutNavService = layoutNavService;
        }

        [HttpGet("navbar")]
        public async Task<ActionResult<IReadOnlyList<LayoutNavDto>>> GetNavbar()
        {
            var items = await _layoutNavService.GetNavbarAsync();
            return Ok(items);
        }
    }
}
