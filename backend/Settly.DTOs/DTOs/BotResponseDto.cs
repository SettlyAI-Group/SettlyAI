namespace Settly.DTOs
{
    public class BotResponseDto
    {
        public string Response { get; set; } = string.Empty;        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
