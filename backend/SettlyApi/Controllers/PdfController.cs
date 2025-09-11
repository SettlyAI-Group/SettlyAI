using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly IPdfService _pdfService;
        private readonly ISuburbService _suburbService;
        public PdfController(IPdfService pdfService, ISuburbService suburbService)
        {
            _pdfService = pdfService;
            _suburbService = suburbService;
        }
        [HttpGet("suburb-report/{suburbId}")]
        public async Task<IActionResult> GetSuburbReport(int suburbId)
        {
            var suburbData = await _suburbService.GetSuburbDataById(suburbId);
            if (suburbData == null)
            {
                return NotFound();
            }
            var pdfBytes = _pdfService.GenerateSuburbReport(suburbData);
            return File(pdfBytes, "application/pdf", $"SuburbReport_{suburbId}.pdf");
        }
        //if other page required, add below as per suburb-report;
    }
}
