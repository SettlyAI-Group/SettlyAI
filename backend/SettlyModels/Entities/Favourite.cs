using System;
namespace SettlyModels.Entities;
public class Favourite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string TargetType { get; set; } = null!;
    public int TargetId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Notes { get; set; }
    public int? Priority { get; set; }
    public User User { get; set; } = null!;
}
