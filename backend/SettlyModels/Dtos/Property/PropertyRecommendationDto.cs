namespace SettlyModels.Dtos;


public class PropertyRecommendationDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = String.Empty;

    public int Price { get; set; }
    public string Address { get; set; } = String.Empty;
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int CarSpaces { get; set; }
    public int SuburbId { get; set; }
}