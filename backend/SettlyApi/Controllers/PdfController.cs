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
                SuburbName = suburbBasicInfo.Name,
                State = suburbBasicInfo.State,
                Postcode = suburbBasicInfo.Postcode,
                HousingMarket = housingMarket,
                Livability = livability,
                IncomeEmployment = incomeEmployment,
                SafetyScores = safetyScores,
                GeneratedAtUtc = DateTime.UtcNow
            };

            // Generate PDF
            var pdfBytes = await _pdfService.GenerateSuburbReportAsync(request);
            var fileName = $"suburb-report-{request.SuburbName.Replace(" ", "-")}-{DateTime.UtcNow:yyyyMMdd}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return ex switch
           {
                KeyNotFoundException => NotFound($"Suburb data not found for ID {suburbId}"),
                NotImplementedException => NotFound($"Suburb not found for ID {suburbId}"),
                _ => StatusCode(500, "An error occurred while generating the PDF report")
            };
        }
    }
}