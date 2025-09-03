namespace SettlyModels.Dtos;

public class SuburbDto
{
    public int SuburbId { get; set; }
    public string State { get; set; } = null!;
    public string Postcode { get; set; } = null!;
    public string Name { get; set; } = null!;
}
