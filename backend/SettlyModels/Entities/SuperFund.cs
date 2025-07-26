namespace SettlyModels.Entities;

public class SuperFund
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal Return1Y { get; set; }
    public decimal Return3Y { get; set; }
    public decimal Return5Y { get; set; }
    public decimal Return10Y { get; set; }
    public decimal Fee { get; set; }

    public ICollection<UserFundSelection> UserFundSelections { get; set; } = new List<UserFundSelection>();
}