using System.Collections.Generic;
using System.Text.Json;
using SettlyModels.Dtos;


public class StampDutyDto
{
    public string Jurisdiction { get; set; } = "";
    public string Version { get; set; } = "";
    public EffectiveDto Effective { get; set; } = new();
    public string Notes { get; set; } = "";
    public Dictionary<string, List<RateBracketDto>> BaseTables { get; set; } = new();
    public List<SelectorDto> Selectors { get; set; } = new();
    public List<ModifierDto> Modifiers { get; set; } = new();
    public RoundingDto? Rounding { get; set; }
}


public class EffectiveDto { public string From { get; set; } = ""; public string? To { get; set; } }

public class RateBracketDto
{
    public decimal Min { get; set; }
    public decimal? Max { get; set; }
    public decimal? Base { get; set; }
    public FormulaDto Formula { get; set; } = new();
}

public class FormulaDto
{
    public string Type { get; set; } = "";
    public decimal Rate { get; set; }
    public decimal? OnExcess { get; set; }
}

public class SelectorDto
{
    // public Dictionary<string, object> Conditions { get; set; } = new();
    public ConditionsDto Conditions { get; set; } = new ConditionsDto();
    public string Table { get; set; } = string.Empty;

    public bool Matches(LoanSimulateInputDto input)
    {
        if (Conditions.Occupancy != null)
        {
            var occupancy = input.IsPPR ? "PPOR" : "GENERAL";
            if (!Conditions.Occupancy.Equals(occupancy, StringComparison.OrdinalIgnoreCase))
                return false;
        }

        if (Conditions.DutiableValueMax.HasValue && input.DutiableValue > Conditions.DutiableValueMax.Value)
            return false;

        return true;
    }
}
public class ConditionsDto
{
    public string? Occupancy { get; set; }
    public decimal? DutiableValueMin { get; set; }
    public decimal? DutiableValueMax { get; set; }
}
public class ModifierDto
{
    public string Id { get; set; } = "";
    public EligibilityDto Eligibility { get; set; } = new();
    public ActionDto Action { get; set; } = new();
    public string Note { get; set; } = "";

    public bool IsEligible(LoanSimulateInputDto input)
    {
        if (Eligibility.IsFirstHomeBuyer.HasValue && Eligibility.IsFirstHomeBuyer.Value && !input.IsFirstHome)
            return false;
        if (Eligibility.DutiableValueMax.HasValue && input.DutiableValue > Eligibility.DutiableValueMax.Value)
            return false;
        if (Eligibility.DutiableValueMin.HasValue && input.DutiableValue < Eligibility.DutiableValueMin.Value)
            return false;
        if (!string.IsNullOrEmpty(Eligibility.PropertyType) && input.PropertyType != Eligibility.PropertyType)
            return false;

        return true;
    }
}

public class EligibilityDto
{
    public bool? IsFirstHomeBuyer { get; set; }
    public bool? IsForeignPerson { get; set; }
    public decimal? DutiableValueMin { get; set; }
    public decimal? DutiableValueMax { get; set; }
    public string PropertyType { get; set; } = "";
}

public class ActionDto
{
    public string Type { get; set; } = "";
    public decimal? Value { get; set; }
    public decimal? Rate { get; set; }
}

public class RoundingDto
{
    public string Mode { get; set; } = "";
}