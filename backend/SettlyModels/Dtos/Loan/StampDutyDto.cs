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

public class StampDutyBracket
{
    public decimal? Min { get; set; }
    public decimal? Max { get; set; }
    public string? Formula { get; set; }
    public decimal? Base { get; set; }
    public string? Marginal { get; set; }
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
    public Dictionary<string, object> Conditions { get; set; } = new();
    public string Table { get; set; } = "";

    public bool Matches(LoanSimulateInputDto input)
    {
        foreach (var kv in Conditions)
        {
            //  var occupancy = input.IsPPR ? "PPOR" : "GENERAL";
            // if (kv.Key.Equals("occupancy", StringComparison.OrdinalIgnoreCase) && kv.Value is string occ)
            // {
            //     // if (!occ.Equals(input.Occupancy, StringComparison.OrdinalIgnoreCase)) return false;
            // }
            if (kv.Key.Equals("dutiableValueMax", StringComparison.OrdinalIgnoreCase) && kv.Value is JsonElement maxEl && maxEl.TryGetDecimal(out var max))
            {
                if (input.DutiableValue > max) return false;
            }
        }
        return true;
    }
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
        // if (Eligibility.IsForeignPerson.HasValue && Eligibility.IsForeignPerson.Value && !input.IsForeignPurchase)
        //     return false;
        if (!string.IsNullOrEmpty(Eligibility.PropertyType) && input.PropertyType != Eligibility.PropertyType)
            return false;

        return true;
    }

    public decimal Apply(decimal currentDuty, LoanSimulateInputDto input)
    {
        return Action.Type switch
        {
            "override_total_to" => Action.Value ?? currentDuty,
            "surcharge_percentage" => currentDuty + currentDuty * (Action.Rate ?? 0),
            _ => currentDuty
        };
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