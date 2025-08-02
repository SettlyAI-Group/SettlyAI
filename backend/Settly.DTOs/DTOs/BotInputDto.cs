using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Settly.DTOs
{
    public class BotInputDto
    {
        [FromQuery(Name = "intent")]
        [Required(ErrorMessage = "The 'intent' query parameter is required")]
        [MinLength(1, ErrorMessage = "'intent' can not be empty.")]
        public string Intent { get; set; } = "start";
    }
}
