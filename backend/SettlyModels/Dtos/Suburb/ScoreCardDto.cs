namespace SettlyModels.Dtos
{
  public class ScoreCardDto
  {
    public string Title { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal MaxValue { get; set; }
    public bool ShowLevelText { get; set; }
    public string? LevelText { get; set; }
    public bool ShowProgress { get; set; }
    public double Percent { get; set; }
    public string Color { get; set; } = "primary";
  }
}