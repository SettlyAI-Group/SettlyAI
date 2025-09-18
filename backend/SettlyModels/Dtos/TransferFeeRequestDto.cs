namespace SettlyModels.Dtos
{
    public class TransferFeeRequestDto
    {
        public decimal DutiableValue { get; set; }
        public int TitlesCount { get; set; } = 1;
    }
}
