using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace SettlyModels.Entities;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = false;

    public ICollection<Verification> EmailVerifications { get; set; } = new List<Verification>();
    public ICollection<Favourite> Favourites { get; set; } = new List<Favourite>();
    public ICollection<InspectionPlan> InspectionPlans { get; set; } = new List<InspectionPlan>();
    public ICollection<LoanCalculation> LoanCalculations { get; set; } = new List<LoanCalculation>();
    public ICollection<ChatLog> ChatLogs { get; set; } = new List<ChatLog>();
    public ICollection<SuperProjectionInput> SuperProjectionInputs { get; set; } = new List<SuperProjectionInput>();
    public ICollection<UserFundSelection> UserFundSelections { get; set; } = new List<UserFundSelection>();
}
