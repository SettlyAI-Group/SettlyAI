using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Settly.Dtos
{
    public class SearchInputDto
    {
        [FromQuery(Name = "q")]
        [MaxLength(40, ErrorMessage = "Your input is too long.")]
        public string? Query { get; set; } = string.Empty;
    }
}
