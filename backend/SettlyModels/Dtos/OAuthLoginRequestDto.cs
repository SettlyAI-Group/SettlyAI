using System.ComponentModel.DataAnnotations;

namespace SettlyModels.Dtos;

public class OAuthLoginRequestDto
{
    [Required(ErrorMessage = "Provider is required")]
    [StringLength(50, ErrorMessage = "Provider name is too long")]
    public string Provider { get; set; } = null!;

    [Required(ErrorMessage = "Authorization code is required")]
    public string Code { get; set; } = null!;
}
