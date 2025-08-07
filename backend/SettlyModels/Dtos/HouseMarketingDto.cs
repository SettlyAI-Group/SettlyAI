namespace SettlyModels.Dtos;
public class HousingMarketDto
{
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
}
