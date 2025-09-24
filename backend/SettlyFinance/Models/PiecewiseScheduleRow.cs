using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Represents a single row in the repayment schedule of a piecewise loan.
    /// Each row corresponds to one payment period.
    /// </summary>
    /// <param name="GlobalPeriod">The overall period number in the entire loan schedule (e.g., 1 to N).</param>
    /// <param name="SegmentIndex">The zero-based index of the segment this schedule row belongs to.</param>
    /// <param name="SegmentPeriod">The period number within the context of the current segment.</param>
    /// <param name="Payment">The total payment amount for this period.</param>
    /// <param name="Interest">The portion of the payment that covers interest.</param>
    /// <param name="Principal">The portion of the payment that reduces the loan balance.</param>
    /// <param name="EndingBalance">The remaining loan balance after this payment.</param>
    /// <param name="SegmentLabel">The label of the segment this row belongs to, useful for display purposes.</param>
    public sealed record PiecewiseScheduleRow(
        int GlobalPeriod,
        int SegmentIndex,
        int SegmentPeriod,
        decimal Payment,
        decimal Interest,
        decimal Principal,
        decimal EndingBalance,
        string? SegmentLabel
    );

}
