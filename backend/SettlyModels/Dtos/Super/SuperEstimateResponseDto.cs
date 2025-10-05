using System.Collections.Generic;

namespace SettlyModels.Dtos
{
    public class SuperEstimateResponseDto
    {
        public List<ProjectionPointDto> WithoutFhss { get; set; } = new();
        public List<ProjectionPointDto>? WithFhss { get; set; }
        public decimal? NetDifference { get; set; }
    }
}
