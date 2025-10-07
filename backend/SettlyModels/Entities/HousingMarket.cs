namespace SettlyModels.Entities;

public class HousingMarket
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public decimal RentalYield { get; set; }
    public int MedianPrice { get; set; }
    public decimal PriceGrowth3Yr { get; set; }
    public int DaysOnMarket { get; set; }
    public int StockOnMarket { get; set; }
    public decimal ClearanceRate { get; set; }
    public int MedianRent { get; set; }
    public decimal RentGrowth12M { get; set; }
    public decimal VacancyRate { get; set; }
    public int Population { get; set; }
    public decimal PopulationGrowthRate { get; set; }
    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}
