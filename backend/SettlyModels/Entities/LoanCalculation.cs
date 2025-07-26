namespace SettlyModels.Entities;

public class LoanCalculation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PropertyId { get; set; }

    public int DepositAmount { get; set; }
    public int LoanAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int LoanTermYears { get; set; }
    public string RepaymentType { get; set; } = null!;
    public int Income { get; set; }

    public int MonthlyRepayment { get; set; }
    public int TotalInterest { get; set; }
    public int TotalCost { get; set; }
    public decimal RepaymentToIncomeRatio { get; set; }

    public int StampDuty { get; set; }
    public int LegalFees { get; set; }
    public int InspectionFees { get; set; }
    public int ApplicationFee { get; set; }
    public int OtherUpfrontCosts { get; set; }

    public decimal StressInterestRate { get; set; }
    public int StressMonthlyRepayment { get; set; }
    public string StressResultNote { get; set; } = null!;

    public int FixedMonthly { get; set; }
    public int VariableMonthly { get; set; }
    public string DifferenceNote { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
    public Property Property { get; set; } = null!;
}