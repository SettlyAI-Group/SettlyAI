namespace SettlyModels.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public ICollection<Favourite> Favourites { get; set; } = new List<Favourite>();
    public ICollection<InspectionPlan> InspectionPlans { get; set; } = new List<InspectionPlan>();
    public ICollection<LoanCalculation> LoanCalculations { get; set; } = new List<LoanCalculation>();
    public ICollection<ChatLog> ChatLogs { get; set; } = new List<ChatLog>();
    public ICollection<SuperProjectionInput> SuperProjectionInputs { get; set; } = new List<SuperProjectionInput>();
    public ICollection<UserFundSelection> UserFundSelections { get; set; } = new List<UserFundSelection>();
}
