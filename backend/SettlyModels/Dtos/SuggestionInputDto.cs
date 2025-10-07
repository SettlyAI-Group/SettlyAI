using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace SettlyModels.Dtos
{
    public class SuggestionInputDto
    {
        [FromQuery(Name = "q")]
        [MaxLength(40)]
        public string Query { get; set; } = string.Empty;
    }
}
