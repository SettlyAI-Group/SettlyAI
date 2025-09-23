namespace SettlyModels.Dtos;

public class SuperEstimateRequestDto
{
    public decimal Balance { get; set; }
    public int Age { get; set; }
    public int TargetAge { get; set; }
    public decimal ContributionRate { get; set; }
    public decimal? FhssAmount { get; set; }
}
