using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Settly.DTOs.DTOs
{
    public class BotInputDto
    {
        [FromQuery(Name = "intent")]
        [Required(ErrorMessage = "The 'intent' query parameter is required")]
        [MinLength(1, ErrorMessage = "'intent' can not be empty.")]
        public string Intent { get; set; } = "start";
    }
}
