
/*
Contract date (used to determine applicable rule set)
○ Dutiable value (property price subject to duty)
○ Regional commercial/industrial/extractive concession (boolean)
○ Foreign purchaser (boolean)
○ Residential property (boolean)
○ Property type (new home, established home, vacant land)
○ Principal Place of Residence (PPR) (boolean)
○ First home buyer (boolean)

"contractDate": "2025-08-18",
"dutiableValue": 700000,
"isRegionalCommercialIndustrialExtractive": false,
"isForeignPurchaser": false,
"isResidentialProperty": true,
"propertyType": "NEW_HOME",
"isPPR": true,
"isFirstHome": true
*/
namespace SettlyModels.Dtos;

public class LoanSimulateInputDto

{
    public string State { get; set; }
    public decimal ContractDate { get; set; }
    public decimal DutiableValue { get; set; }
    public bool IsRegionalCommercialIndustrialExtractive { get; set; }
    public bool IsResidentialProperty { get; set; }
    public bool IsForeignPurchase { get; set; }
    public string PropertyType { get; set; } = String.Empty;
    public bool IsPPR { get; set; }
    public bool IsFirstHome { get; set; }

}