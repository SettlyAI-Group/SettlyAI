namespace SettlyModels.Dtos;

public class LoanSimulateInputDto

{
    public string State { get; set; }
    public decimal DutiableValue { get; set; }
    public bool IsPPR { get; set; }
    public bool IsFirstHome { get; set; }
    public bool IsForeignPurchase { get; set; }
    public string PropertyType { get; set; } = String.Empty;

    public bool IsRegionalCommercialIndustrialExtractive { get; set; }
    public bool IsResidentialProperty { get; set; }
    public DateTime ContractDate { get; set; }

}