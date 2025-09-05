namespace SettlyModels.Dtos
{
    public class LayoutNavDto
    {
        public  required string Id { get; set; }

        public required string Label { get; set; }

        public required string Path { get; set; }

        public required string Position { get; set; }

        public required int Order { get; set; }

        public string? Variant { get; set; }

        public List<LayoutNavDto>? SubItems { get; set; }

    }
}
