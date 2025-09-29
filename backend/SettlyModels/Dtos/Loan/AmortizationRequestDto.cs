using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
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
        int TermPeriods,
       [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentFrequency Frequency,
        [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentType RepaymentType,
        bool GenerateSchedule = false
    );
}
