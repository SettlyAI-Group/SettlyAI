namespace SettlyModels.Dtos
{
    public class TransferFeeResponseDto
    {
        public string VersionTag { get; set; } = string.Empty;
        public decimal DutiableValue { get; set; }
        public int TitlesCount { get; set; }
        public long Thousands { get; set; }
        public decimal FeeBeforeCap { get; set; }
        public decimal Cap { get; set; }
        public decimal FeeStatutory { get; set; }
    }
}
