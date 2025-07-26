namespace SettlyModels.Entities;

public class SettlyAIScore
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public decimal AffordabilityScore { get; set; }
    public decimal GrowthPotentialScore { get; set; }
    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}