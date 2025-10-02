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
    /// Represents a client request for a piecewise (multi-segment) loan calculation.
    /// </summary>
    public sealed record PiecewiseRequestDto(
        decimal InitialLoanAmount,
        [property: JsonConverter(typeof(JsonStringEnumConverter))]
        RepaymentFrequency Frequency,
        List<PiecewiseSegmentDto> Segments,
        bool GenerateSchedule = true,
        decimal? NetAnnualIncome = null
    );
}
