namespace SettlyModels.Dtos;

public class LivabilityDto
{
    public decimal TransportScore { get; set; }
    public int SupermarketQuantity { get; set; }
    public int HospitalQuantity { get; set; }
    public decimal PrimarySchoolRating { get; set; }
    public decimal SecondarySchoolRating { get; set; }
    public decimal HospitalDensity { get; set; }
}
