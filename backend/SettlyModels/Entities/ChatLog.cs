namespace SettlyModels.Entities;

public class ChatLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Message { get; set; } = null!;
    public bool IsUser { get; set; }
    public DateTime Timestamp { get; set; }

    public User User { get; set; } = null!;
}
