namespace Settly.Dtos
{
    public class SearchOutputDto
    {
        public string Name { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty;
        public int? Price { get; set; }
    }
}
