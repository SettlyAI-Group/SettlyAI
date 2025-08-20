using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetTestimonials()
        {
            var testimonials = _testimonialService.GetTestimonials();
            return Ok(testimonials);
        }
    }
}
