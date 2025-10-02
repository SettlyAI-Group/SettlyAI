using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using SettlyModels.Dtos.Export;

namespace SettlyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PdfController : ControllerBase
{
    private readonly IPdfExportService _pdfService;
    private readonly ISuburbService _suburbService;

    public PdfController(IPdfExportService pdfService, ISuburbService suburbService)
    {
        _pdfService = pdfService;
        _suburbService = suburbService;
    }

    [HttpPost("suburb/{suburbId}")]
    [SwaggerOperation(
        Summary = "Generate suburb report PDF from database",
        Description = "Fetches suburb data from database and creates a PDF report"
    )]
    [SwaggerResponse(200, "Suburb report PDF file", typeof(FileContentResult))]
    [SwaggerResponse(404, "Suburb not found")]
    public async Task<IActionResult> GenerateSuburbReportFromDb(int suburbId)
    {
        try
        {
            // Fetch data from existing services
            var suburbBasicInfo = await _suburbService.GetSuburbsByIdAsync(suburbId);
            var housingMarket = await _suburbService.GetHousingMarketAsync(suburbId);
            var livability = await _suburbService.GetLivabilityAsync(suburbId);
            var incomeEmployment = await _suburbService.GetIncomeAsync(suburbId);
            var safetyScores = await _suburbService.GetSafetyScoresAsync(suburbId);

            // Build the request object
            var request = new SuburbReportPdfRequest
            {
                SuburbId = suburbId,
                SuburbName = suburbBasicInfo?.Name ?? "Unknown",
                State = suburbBasicInfo?.State ?? "Unknown",
                Postcode = suburbBasicInfo?.Postcode ?? "Unknown",
                HousingMarket = housingMarket,
                Livability = livability,
                IncomeEmployment = incomeEmployment,
                SafetyScores = safetyScores,
                GeneratedAtUtc = DateTime.UtcNow
            };

            // Generate PDF
            var pdfBytes = _pdfService.GenerateSuburbReport(request);
            var fileName = $"suburb-report-{request.SuburbName.Replace(" ", "-")}-{DateTime.UtcNow:yyyyMMdd}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to generate PDF: {ex.Message}");
        }
    }
}