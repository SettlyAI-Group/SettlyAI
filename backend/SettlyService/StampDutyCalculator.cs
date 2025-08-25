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
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        _data = JsonSerializer.Deserialize<StampDutyDto>(json, options)
                ?? throw new Exception("Failed to deserialize stamp duty JSON.");
        // Ensure dictionary is case-insensitive
        _data.BaseTables = new Dictionary<string, List<RateBracketDto>>(
            _data.BaseTables,
            StringComparer.OrdinalIgnoreCase
        );
    }
    public StampDutyCalculator(StampDutyDto data)
    {
        _data = data;
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

                duty = modifier.Apply(duty, input);
                return new Concession
                {
                    Label = modifier.Id,
                    Value = duty
                };
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
            if (modifier.Id == "vic_foreign_purchaser_additional_duty")
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
