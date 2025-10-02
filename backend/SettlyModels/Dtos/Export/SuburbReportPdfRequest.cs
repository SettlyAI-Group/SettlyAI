using SettlyModels.Dtos;

namespace SettlyModels.Dtos.Export;

public class SuburbReportPdfRequest
{
    public int SuburbId { get; set; }
    public string SuburbName { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;
    public HousingMarketDto? HousingMarket { get; set; }
    public LivabilityDto? Livability { get; set; }
    public IncomeEmploymentDto? IncomeEmployment { get; set; }
    public List<ScoreCardDto>? SafetyScores { get; set; }
    public Dictionary<string, object> Metrics { get; set; } = new();
    public string? Summary { get; set; }
    public List<string> Charts { get; set; } = new(); // base64 PNG
    public PdfOptions Options { get; set; } = new();
}

public class PdfOptions
{
    public bool IncludeCharts { get; set; } = true;
    public bool IncludeSummary { get; set; } = true;
}