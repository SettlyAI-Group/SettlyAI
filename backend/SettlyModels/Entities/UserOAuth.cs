using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace SettlyModels.Entities;

[Index(nameof(Provider), nameof(ProviderUserId), IsUnique = true)]
public class UserOAuth
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Provider { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string ProviderUserId { get; set; } = null!;

    [MaxLength(255)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
}
