namespace SettlyModels.Entities;

public class InspectionPlan
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PropertyId { get; set; }
    public DateTime ScheduledTime { get; set; }
    public string Note { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
    public Property Property { get; set; } = null!;
}
