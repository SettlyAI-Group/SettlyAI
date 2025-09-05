namespace SettlyModels.Entities;

public class Property
{
    public int Id { get; set; }
    public int SuburbId { get; set; }
    public string Address { get; set; } = null!;
    public string PropertyType { get; set; } = null!;
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int CarSpaces { get; set; }
    public int Price { get; set; }
    public int InternalArea { get; set; }
    public int LandSize { get; set; }
    public int YearBuilt { get; set; }
    public string[] Features { get; set; } = [];
    public string Summary { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<DateTime> InspectionTimeOptions { get; set; } = new List<DateTime>();

    public Suburb Suburb { get; set; } = null!;
    public ICollection<Favourite> Favourites { get; set; } = new List<Favourite>();
    public ICollection<InspectionPlan> InspectionPlans { get; set; } = new List<InspectionPlan>();
    public ICollection<LoanCalculation> LoanCalculations { get; set; } = new List<LoanCalculation>();
}
