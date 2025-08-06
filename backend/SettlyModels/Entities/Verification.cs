using System.ComponentModel.DataAnnotations;
using SettlyModels.Enums;

namespace SettlyModels.Entities;

public class Verification
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = null!;
    public VerificationType VerificationType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime Expiry { get; set; }

    public bool IsUsed { get; set; } = false;
}
