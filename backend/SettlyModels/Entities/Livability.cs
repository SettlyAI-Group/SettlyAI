namespace SettlyModels.Entities;

public class Livability
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public decimal TransportScore { get; set; }
    public int SupermarketQuantity { get; set; }
    public int HospitalQuantity { get; set; }
    public decimal PrimarySchoolRating { get; set; }
    public decimal SecondarySchoolRating { get; set; }
    public decimal HospitalDensity { get; set; }
    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}
