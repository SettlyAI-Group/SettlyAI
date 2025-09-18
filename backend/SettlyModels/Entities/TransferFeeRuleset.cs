namespace SettlyModels.Entities
{
    public class TransferFeeRuleset
    {
        public decimal BaseFixed { get; set; }
        public decimal Per1000 { get; set; }
        public decimal Cap { get; set; }
        public decimal PerTitle { get; set; }
        public string VersionTag { get; set; } = string.Empty;
    }
}
