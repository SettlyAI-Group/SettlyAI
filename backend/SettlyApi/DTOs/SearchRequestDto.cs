using System.ComponentModel.DataAnnotations;

namespace SettlyApi.DTOs
{
    public class SearchRequestDto
    {
        [Required, MaxLength(40)]
        public string Query { get; set; } = string.Empty;
    }
}
