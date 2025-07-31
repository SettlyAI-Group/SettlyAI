using System.ComponentModel.DataAnnotations;

namespace Settly.DTOs
{
    public class SearchRequestDto
    {
        [Required, MaxLength(40)]
        public string Query { get; set; } = string.Empty;
    }
}
