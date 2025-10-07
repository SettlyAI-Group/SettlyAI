namespace SettlyModels.Entities;

public class Suburb
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string State { get; set; } = null!;
    public string Postcode { get; set; } = null!;

    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<HousingMarket> HousingMarkets { get; set; } = new List<HousingMarket>();
    public ICollection<Livability> Livabilities { get; set; } = new List<Livability>();
    public ICollection<PopulationSupply> PopulationSupplies { get; set; } = new List<PopulationSupply>();
    public ICollection<IncomeEmployment> IncomeEmployments { get; set; } = new List<IncomeEmployment>();
    public ICollection<SettlyAIScore> SettlyAIScores { get; set; } = new List<SettlyAIScore>();
    public ICollection<RiskDevelopment> RiskDevelopments { get; set; } = new List<RiskDevelopment>();
}
