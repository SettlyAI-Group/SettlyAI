using System.ComponentModel.DataAnnotations;

namespace SettlyModels.Dtos
{
    public class MapInputDto
    {
        public string? Suburb { get; set; }
        public string? Postcode { get; set; }
        [Required] public string State { get; set; } 
    }
}
