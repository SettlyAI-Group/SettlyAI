using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyModels.DTOs.Loan
{

    public sealed record PiecewiseSegmentDto(
        [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentType RepaymentType,
        decimal AnnualInterestRate,
        int LoanTermYears
        //[property: JsonConverter(typeof(JsonStringEnumConverter))]
        //RepaymentFrequency Frequency
    );
}
