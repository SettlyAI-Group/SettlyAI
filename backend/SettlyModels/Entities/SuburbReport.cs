namespace SettlyModels.Entities;

public class SuburbReport
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
   
    #region IncomeAndEmployment
    public string MedianIncome { get; set; }
    public string MedianExpenses { get; set; }
    public float EmploymentRate { get; set; }
    public float WhiteCollarRatio { get; set; }
    public float JobGrowth { get; set; }
    #endregion
   
    #region PropertyMarketInsights
    public string MedianPrice { get; set; }
    public string RentalYield { get; set; }
    public decimal SalesMarketPrice { get; set; }
    public decimal PriceGrowthThreeYear { get; set; }
    public int SalesDaysOnMarket { get; set; }
    public decimal ClearanceRate { get; set; }
    public decimal RentalMarketWeeklyRent { get; set; }
    public decimal RentGrowthTwelveMonth { get; set; }
    public decimal VacancyRate { get; set; }
    public int RentalDaysOnMarket { get; set; }
    #endregion

    #region DemandAndDevelopment
    public decimal RentersRatio { get; set; }
    public string LandSupply { get; set; }
    public int BuildingApprovals { get; set; }
    public int BuildingApprovalsTimeFrame { get; set; }
    public int DevelopmentProjects { get; set; }
    #endregion
   
    #region LifestyleAndAccessibility
    public decimal SupermarketDistance { get; set; }
    public decimal HospitalDistance { get; set; }
    public decimal TransportScore { get; set; }
    public decimal PrimarySchoolScore { get; set; }
    public decimal SecondarySchoolScore { get; set; }
    public decimal HospitalDensity { get; set; }
    #endregion
   
    #region SafetyAndScores
    public float CrimeRate { get; set; }
    public decimal AffordabilityScore { get; set; }
    public decimal GrowthPotential { get; set; }
    #endregion
   
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
   
    // Navigation property
    public Suburb Suburb { get; set; }
}