namespace SettlyModels.Entities;

public class RiskDevelopment
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public decimal CrimeRate { get; set; }

    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}
