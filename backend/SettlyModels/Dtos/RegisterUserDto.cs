using System.ComponentModel.DataAnnotations;
using SettlyModels.Enums;
using SettlyModels.Validation;

namespace SettlyModels.Dtos;

public class RegisterUserDto
{
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string FullName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Range(1, 1, ErrorMessage = "Only Email verification is supported for now.")]
    public VerificationType? VerificationType { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [ValidPassword]
    public string Password { get; set; } = null!;
}
