namespace SettlyModels.Entities;

public class IncomeEmployment
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public int MedianIncome { get; set; }
    public decimal EmploymentRate { get; set; }
    public decimal WhiteCollarRatio { get; set; }
    public decimal JobGrowthRate { get; set; }
    public DateTime SnapshotDate { get; set; }

    public Suburb Suburb { get; set; } = null!;
}
