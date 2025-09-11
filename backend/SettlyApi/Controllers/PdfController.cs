using ISettlyService;
using Microsoft.AspNetCore.Mvc;
namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly IPdfService _pdfService;
        public PdfController(IPdfService pdfService)
        {
            _pdfService = pdfService;
            //add other services as required
        }
        [HttpGet("test")]
        public IActionResult GetSampleReport()
        {
            var pdfBytes = _pdfService.GenerateSampleReport();
            return File(pdfBytes, "application/pdf", "SampleReport.pdf");
        }
        //Add other pages required for PDF generation heree.g. suburb report, property report etc.;
    }
}
