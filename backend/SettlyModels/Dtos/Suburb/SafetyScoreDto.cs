
namespace SettlyModels.Dtos.Suburb
{
  public record SafetyScoreDto(
      string Id,
      string Title,
      string Value,
      string MaxValue,
      int ProgressPercentage,
      string? Label,
      string Color
  );
  public record SafetyScoreOutputDto(
      SafetyScoreDto CrimeRate,
      SafetyScoreDto AffordabilityScore,
      SafetyScoreDto GrowthPotentialScore
  );
}