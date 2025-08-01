using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Settly.DTOs
{
    public class SearchRequestDto
    {
        [FromQuery(Name = "q")]
        [Required(ErrorMessage = "The query parameter 'q' is required.")]        
        [MaxLength(40, ErrorMessage = "Query too long; maximum is 40 characters.")]
        public string Query { get; set; } = string.Empty;
    }
}
