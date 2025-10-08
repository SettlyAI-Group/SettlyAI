using System.Text.Json.Serialization;
using SettlyFinance.Enums;
namespace SettlyModels.DTOs.Loan
{
    /// <summary>
    /// Represents a client request to calculate amortization.
    /// </summary>
    public sealed record AmortizationRequestDto
    (
        decimal LoanAmount,
        decimal AnnualInterestRate,
        int LoanTermYears,
        [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentFrequency Frequency,
        [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentType RepaymentType,
        bool GenerateSchedule = false,
        decimal? NetAnnualIncome = null,
        bool? AggregateScheduleByYear = null //optional for Yearly Schedule
    );
} 
