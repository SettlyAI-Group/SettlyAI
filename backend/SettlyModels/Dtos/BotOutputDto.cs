namespace Settly.Dtos
{
    public class BotOutputDto
    {
        public string Response { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
