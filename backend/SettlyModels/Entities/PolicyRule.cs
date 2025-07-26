namespace SettlyModels.Entities;

public class PolicyRule
{
    public int Id { get; set; }
    public int? SuburbId { get; set; }
    public string State { get; set; } = null!;
    public string RuleType { get; set; } = null!; // e.g., "FirstHomeBuyer"
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Eligibility { get; set; } = null!;
    public string Link { get; set; } = null!;
    public DateTime EffectiveDate { get; set; }

    public Suburb? Suburb { get; set; }
}