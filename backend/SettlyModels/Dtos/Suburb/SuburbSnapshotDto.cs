
namespace SettlyModels.Dtos;

public class SuburbSnapshotDto
{
    public string Id { get; set; } = string.Empty;
    public string State { get; set; } = null!;
    public string Postcode { get; set; } = null!;
    public string SuburbName { get; set; } = null!;

    public int? MedianPrice { get; set; }
    public decimal?  VacancyRatePct { get; set; }

}