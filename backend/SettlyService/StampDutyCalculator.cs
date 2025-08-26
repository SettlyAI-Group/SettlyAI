using System.Reflection.Emit;
using System.Text.Json;
using Microsoft.Extensions.ObjectPool;
using SettlyModels.Dtos;

public class StampDutyCalculator
{
    private readonly StampDutyDto _data;
    public StampDutyCalculator(string jsonFilePath)
    {
        if (!File.Exists(jsonFilePath))
            throw new FileNotFoundException("Stamp duty JSON file not found.", jsonFilePath);

        var json = File.ReadAllText(jsonFilePath);

        _data = DeserializeJson(json);
    }
    private static StampDutyDto DeserializeJson(string json)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var data = JsonSerializer.Deserialize<StampDutyDto>(json, options)
                   ?? throw new Exception("Failed to deserialize stamp duty JSON.");

        // Ignore cases
        data.BaseTables = new Dictionary<string, List<RateBracketDto>>(
            data.BaseTables,
            StringComparer.OrdinalIgnoreCase
        );

        return data;
    }
    public StampDutyOutputDto Calculate(LoanSimulateInputDto input)
    {

        if (_data == null)
            throw new InvalidOperationException("Stamp duty data not loaded. Call LoadJson() first.");

        var tableKey = SelectBaseTable(input);
        var baseDuty = CalculateBaseDuty(input, tableKey);
        var concessionDuty = ApplyConcessions(baseDuty, input);
        var surcharge = ApplyForeignSurcharge(input);
        var total = concessionDuty.Value + surcharge;
        var finalDuty = ApplyRounding(total);

        return new StampDutyOutputDto
        {
            BaseDuty = baseDuty,
            Concessions = concessionDuty,
            ForiegnSurcharge = surcharge,
            FinalDuty = finalDuty
        };
    }
    /// <summary>
    /// Step 1: select base table
    /// </summary>
    private string SelectBaseTable(LoanSimulateInputDto input)
    {

        if (input.State.ToLower() != "vic")
            throw new InvalidOperationException(
                        $"no implement calculator for (State={input.State}, Value={input.DutiableValue})");
        foreach (var selector in _data.Selectors)
        {
            if (selector.Matches(input))
            {
                if (_data.BaseTables.ContainsKey(selector.Table))
                    return selector.Table;
            }
        }

        throw new InvalidOperationException(
            $"No matching base table found for input (State={input.State}, Value={input.DutiableValue})");
    }

    /// <summary>
    /// Step 2: calculate base duty by table
    /// </summary>
    private decimal CalculateBaseDuty(LoanSimulateInputDto input, string tableKey)
    {
        var table = _data.BaseTables[tableKey];

        foreach (var bracket in table)
        {
            bool withinRange = input.DutiableValue >= bracket.Min &&
                              (!bracket.Max.HasValue || input.DutiableValue <= bracket.Max.Value);

            if (withinRange)
            {
                if (bracket.Formula.Type == "percentage")
                {
                    return (bracket.Base ?? 0)
                         + (input.DutiableValue - (bracket.Formula.OnExcess ?? 0)) * bracket.Formula.Rate;
                }
            }
        }

        throw new InvalidOperationException($"No bracket found for value {input.DutiableValue} in table {tableKey}");
    }
    /// <summary>
    /// Step 3: concessions/ surcharge
    /// </summary>
    private Concession ApplyConcessions(decimal duty, LoanSimulateInputDto input)
    {

        var concession = new Concession
        {
            Label = "no_concession",
            Value = duty
        };
        if (!input.IsFirstHome) return concession;

        foreach (var modifier in _data.Modifiers)
        {
            if (modifier.IsEligible(input))
            {
                if (modifier.Id.Contains("exemption") && input.DutiableValue <= modifier.Eligibility.DutiableValueMax)
                    return new Concession { Label = modifier.Id, Value = 0 };
                if (modifier.Id.Contains("concession") && input.DutiableValue <= modifier.Eligibility.DutiableValueMax && input.DutiableValue >= modifier.Eligibility.DutiableValueMin)
                {
                    decimal discountRate = (decimal)((input.DutiableValue - modifier.Eligibility.DutiableValueMin + 1) / (modifier.Eligibility.DutiableValueMax - modifier.Eligibility.DutiableValueMin + 1));

                    return new Concession
                    {
                        Label = modifier.Id,
                        Value = duty * discountRate,
                    };
                }

            }
        }
        return concession;
    }

    private decimal ApplyForeignSurcharge(LoanSimulateInputDto input)
    {
        decimal surcharge = 0;
        if (input.IsForeignPurchase == false) return surcharge;

        foreach (var modifier in _data.Modifiers)
        {
            if (modifier.Id.Contains("foreign_purchaser"))
            {
                surcharge = input.DutiableValue * (modifier.Action.Rate ?? 0);
                return surcharge;
            }

        }
        return surcharge;
    }

    /// <summary>
    /// Step 4: rounding
    /// </summary>
    private decimal ApplyRounding(decimal duty)
    {
        if (_data.Rounding != null)
        {
            switch (_data.Rounding.Mode)
            {
                case "floor_to_dollar":
                    return Math.Floor(duty);
                case "round_to_dollar":
                    return Math.Round(duty);
                case "ceil_to_dollar":
                    return Math.Ceiling(duty);
            }
        }
        return duty;
    }


}
