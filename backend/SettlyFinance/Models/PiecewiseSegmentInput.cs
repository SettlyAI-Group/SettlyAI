using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Represents the input parameters for a single segment of a piecewise loan.
    /// A piecewise loan is composed of one or more sequential segments, each with its own terms.
    /// </summary>
    /// <param name="Type">The type of repayment for this segment (e.g., Interest Only, Principal & Interest).</param>
    /// <param name="AnnualInterestRate">The annual interest rate for this segment.</param>
    /// <param name="TermPeriods">The duration of this segment, expressed in the number of periods (e.g., 36 months).</param>
    /// <param name="Frequency">The repayment frequency for this segment (e.g., Monthly, Weekly).</param>
    /// <param name="GenerateSchedule">A flag indicating whether to generate a detailed schedule for this specific segment.</param>
    /// <param name="Label">An optional label for the segment for easy identification (e.g., "IO-36m").</param>
    public sealed record PiecewiseSegmentInput
    (
        RepaymentType Type,
        decimal AnnualInterestRate,
        int TermPeriods,
        RepaymentFrequency Frequency,
        bool GenerateSchedule = true,
        string? Label = null
    );
}
