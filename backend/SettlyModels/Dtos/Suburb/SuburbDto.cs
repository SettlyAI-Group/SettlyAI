namespace SettlyModels.Dtos;

public class SuburbDto
{
    public string Id { get; set; } = string.Empty;
    public int SuburbId { get; set; }
    public string State { get; set; } = null!;
    public string Postcode { get; set; } = null!;
    public string SuburbName { get; set; } = null!;
}
