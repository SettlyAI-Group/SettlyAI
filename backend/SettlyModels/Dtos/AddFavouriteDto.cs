namespace SettlyModels.Dtos;
public class AddFavouriteDto
{
    public string TargetType { get; set; } = null!;
    public int TargetId { get; set; }
    public string? Notes { get; set; }
    public int? Priority { get; set; }
}
