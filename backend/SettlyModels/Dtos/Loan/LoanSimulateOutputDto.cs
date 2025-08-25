
using System.Reflection.Emit;

namespace SettlyModels.Dtos;

public class LoanSimulateOutputDto

{
    public required StampDutyOutputDto StampDutyOutput{ get; set; }
    //todo: add other fees below
}

public class StampDutyOutputDto
{
    public decimal BaseDuty { get; set; }
    public Concession? Concessions { get; set; }

    public decimal ForiegnSurcharge { get; set; }

    public decimal FinalDuty { get; set; }
}

public class Concession
{
    public string Label { get; set; }
    public decimal Value { get; set; }
}