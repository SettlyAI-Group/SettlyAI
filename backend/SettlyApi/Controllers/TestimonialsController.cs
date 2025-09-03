using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestimonialsController : ControllerBase
    {
        private readonly ITestimonialService _testimonialService;

        public TestimonialsController(ITestimonialService testimonialService)
        {
            _testimonialService = testimonialService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestimonialDto>>> GetTestimonials()
        {
            var testimonials = await _testimonialService.GetTestimonialsAsync();
            return Ok(testimonials);
        }
    }
}
