namespace SettlyModels.Dtos
{
    public class TransferFeeRequestDto
    {
        public decimal DutiableValue { get; set; }
        public int TitlesCount { get; set; } = 1;
        public string VersionTag { get; set; } = "vic_transfer_2025_26_paper";

    }
}
