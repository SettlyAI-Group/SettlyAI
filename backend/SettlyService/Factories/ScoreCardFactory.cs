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
                MaxValue = 10m,
                ShowProgress = false,
                ShowLevelText = true,
                GetLevelText = (Func<decimal, string>)(v => v < 3 ? "Low" : v < 7 ? "Medium" : "High"),
                GetColor = (Func<decimal, string>)(v => v < 3 ? "success" : v < 7 ? "primary" : "error")
            },

            new {
                Title = "Affordability Score",
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
                GetColor = (Func<decimal, string>)(v => "success")
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
