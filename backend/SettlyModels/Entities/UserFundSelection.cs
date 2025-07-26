namespace SettlyModels.Entities;

public class UserFundSelection
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int InputId { get; set; }
    public int FundId { get; set; }

    public User User { get; set; } = null!;
    public SuperProjectionInput Input { get; set; } = null!;
    public SuperFund Fund { get; set; } = null!;
}