using SettlyModels.Enums;
using System.ComponentModel.DataAnnotations;

namespace SettlyModels.Dtos;

public sealed class VerifyCodeDto
{
    public int UserId { get; set; }
    public string Code { get; set; } = default!;
    public VerificationType VerificationType { get; set; }
}

public sealed class ResendVerificationDto
{
    [Required(ErrorMessage = "UserId is required")]
    public int UserId { get; set; }
    
    [Range(1, 1, ErrorMessage = "Only Email verification is supported for now.")]
    public VerificationType VerificationType { get; set; }
}
