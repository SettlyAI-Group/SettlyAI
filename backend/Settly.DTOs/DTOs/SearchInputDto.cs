using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Settly.DTOs
{
    public class SearchInputDto
    {
        [FromQuery(Name = "q")]
        [Required(ErrorMessage = "Your input can't be empty")]        
        [MaxLength(40, ErrorMessage = "Your input is too long.")]
        [MinLength(3, ErrorMessage = "Your input is invalid.")]
        public string Query { get; set; } = string.Empty;
    }
}
