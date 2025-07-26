namespace SettlyModels.Entities;

public class SuperProjectionResult
{
    public int Id { get; set; }
    public int InputId { get; set; }
    public int ProjectedBalanceAtRetirement { get; set; }
    public int BalanceWithFhss { get; set; }
    public int BalanceWithoutFhss { get; set; }
    public int NetDifference { get; set; }
    public int FhssWithdrawableAmount { get; set; }

    public SuperProjectionInput Input { get; set; } = null!;
}