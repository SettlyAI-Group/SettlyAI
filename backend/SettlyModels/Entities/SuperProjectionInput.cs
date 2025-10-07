namespace SettlyModels.Entities;

public class SuperProjectionInput
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CurrentBalance { get; set; }
    public int Salary { get; set; }
    public int CurrentAge { get; set; }
    public int RetirementAge { get; set; }
    public decimal EmployerContributionRate { get; set; }
    public bool UseFhss { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
    public SuperProjectionResult? Result { get; set; }
    public SuperProjectionInsight? Insight { get; set; }
    public ICollection<UserFundSelection> FundSelections { get; set; } = new List<UserFundSelection>();
}
