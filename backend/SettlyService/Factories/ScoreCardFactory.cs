namespace SettlyService.Factories
{
  using SettlyModels.Dtos;
  using System.Collections.Generic;

  public static class ScoreCardFactory
  {
    public static List<ScoreCardDto> Build(ScoresCardsAggregateDto src)
    {
      var rules = new[]
        {
            new {
                Title = "Crime Rate",
                Value = src.CrimeRate,
                MaxValue = 1000m,
                ShowProgress = false,
                ShowLevelText = true,
                GetLevelText = (Func<decimal, string>)(v => v < 300 ? "Low" : v < 700 ? "Medium" : "High"),
                GetColor = (Func<decimal, string>)(v => v < 300 ? "success" : v < 700 ? "warning" : "error")
            },

            new {
                Title = "Affordability",
                Value = src.AffordabilityScore,
                MaxValue = 10m,
                ShowProgress = true,
                ShowLevelText = false,
                GetLevelText = (Func<decimal, string>)(v => string.Empty),
                GetColor = (Func<decimal, string>)(v => "primary")
            },

            new {
                Title = "Growth Potential",
                Value = src.GrowthPotentialScore,
                MaxValue = 10m,
                ShowProgress = true,
                ShowLevelText = false,
                GetLevelText = (Func<decimal, string>)(v => string.Empty),
                GetColor = (Func<decimal, string>)(v => "primary")
            }
        };

      return rules.Select(rule => new ScoreCardDto
      {
        Title = rule.Title,
        Value = rule.Value,
        MaxValue = rule.MaxValue,
        ShowProgress = rule.ShowProgress,
        ShowLevelText = rule.ShowLevelText,
        LevelText = rule.ShowLevelText ? rule.GetLevelText(rule.Value) : null,
        Percent = (double)(rule.ShowProgress ? (rule.Value / rule.MaxValue) * 100 : 0),
        Color = rule.GetColor(rule.Value)
      }).ToList();
    }
  }
}
