using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PdfController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public PdfController(IPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpGet("test")]
    [SwaggerOperation(
        Summary = "Generate sample PDF", 
        Description = "Returns a simple test PDF to verify QuestPDF is working correctly"
    )]
    [SwaggerResponse(200, "Sample PDF file", typeof(FileContentResult))]
    public IActionResult GetSamplePdf()
    {
        var pdfBytes = _pdfService.GenerateSampleReport();
        return File(pdfBytes, "application/pdf", "SampleReport.pdf");
    }
}