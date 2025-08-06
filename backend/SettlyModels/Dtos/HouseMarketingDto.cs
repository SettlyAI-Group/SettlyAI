namespace SettlyModels.Dtos;
public class HousingMarketDto
{
    public float MedianPrice { get; set; }
    public float PriceGrowth3Yr { get; set; }
    public int DaysOnMarket { get; set; }
    public float ClearanceRate { get; set; }
    public float MedianRent { get; set; }
    public float RentGrowth12M { get; set; }
    public float VacancyRate { get; set; }
    public float RentalYield { get; set; }
}
