using System.Text.Json;
using SettlyModels.Dtos;
//todo: vic only, add other states later
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
    public decimal Calculate(LoanSimulateInputDto input)
    {

        if (_data == null)
            throw new InvalidOperationException("Stamp duty data not loaded. Call LoadJson() first.");

        var tableKey = SelectBaseTable(input);
        var baseDuty = CalculateBaseDuty(input, tableKey);
        var modifiedDuty = ApplyModifiers(baseDuty, input);
        var finalDuty = ApplyRounding(modifiedDuty);

        return finalDuty;
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
    /// Step 2: calculate duty by table
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
    /// Step 3: discount/ surcharge
    /// </summary>
    private decimal ApplyModifiers(decimal duty, LoanSimulateInputDto input)
    {
        foreach (var modifier in _data.Modifiers)
        {
            if (modifier.IsEligible(input))
            {
                duty = modifier.Apply(duty, input);
            }
        }
        return duty;
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
