namespace SettlyModels.Entities;

public class SuperProjectionInsight
{
    public int Id { get; set; }
    public int InputId { get; set; }
    public string SummaryNote { get; set; } = null!;
    public string RecommendationNote { get; set; } = null!;

    public SuperProjectionInput Input { get; set; } = null!;
}
