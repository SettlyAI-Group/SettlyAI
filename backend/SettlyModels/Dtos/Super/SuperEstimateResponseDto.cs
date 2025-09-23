namespace SettlyModels.Dtos
{
    public class SuperEstimateResponseDto
    {
        public ProjectionSeries WithoutFhss { get; set; } = new ProjectionSeries();
        public ProjectionSeries? WithFhss { get; set; }
        public decimal NetDifference { get; set; }
        public List<string> Disclaimers { get; set; } = new();
        public List<string> FhssNotes { get; set; } = new();
    }

    public class ProjectionSeries
    {
        public List<ProjectionPointDto> Series { get; set; } = new();
        public decimal FinalValue { get; set; }
    }
}

