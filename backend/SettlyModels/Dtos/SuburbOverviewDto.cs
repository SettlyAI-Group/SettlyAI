namespace SettlyModels.Dtos
{
    public class SuburbOverviewDto
    {
        public SuburbOverviewSuburbDto? Suburb { get; set; }

        public SuburbOverviewMetricsDto? Metrics { get; set; }

        public SuburbOverviewSummaryDto? Summary { get; set; }

        public IReadOnlyList<string> Highlights { get; set; } = Array.Empty<string>();
    }

    //1.Dto for helper function 
   public class SuburbOverviewSuburbDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public string StateCode { get; set; } = "VIC";

        public string? Postcode { get; set; }
    }

    //2.Dto for helper function 
    public class SuburbOverviewMetricsDto
    {
        public int? MedianPrice { get; set; }        
        public string? MedianPriceFormatted => MedianPrice?.ToString("N0");
        public decimal? PriceGrowth3YrPct { get; set; }

        public SafetyDto? Safety { get; set; }

        public AffordabilityDto? Affordability { get; set; }
    }

    public class SafetyDto
    {
        public string? CrimeLevel { get; set; }
        public string? SafetyLabel { get; set; }
    }

    public class AffordabilityDto
    {
        public decimal? Score { get; set; }

        public string? Label { get; set; }
    }

    //3.Dto for helper function
    public class SuburbOverviewSummaryDto
    {
        public string? Text { get; set; }
        public string Status { get; set; } = "ready";
        public string Source { get; set; } = "template";
    }

    







}
