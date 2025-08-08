using System.ComponentModel.DataAnnotations;
using SettlyModels.Validation;

namespace SettlyModels.Dtos
{
    public class LoginInputDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [ValidPassword]
        public string Password { get; set; } = null!;
    }
}
