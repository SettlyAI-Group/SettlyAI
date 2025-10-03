using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Represents the complete input for a piecewise loan calculation, including the initial amount and all segments.
    /// </summary>
    /// <param name="InitialLoanAmount">The principal amount at the beginning of the loan.</param>
    /// <param name="Segments">A read-only list of the segments that constitute the loan's structure.</param>
    /// <param name="GenerateSchedule">A master switch to enable or disable the generation of the full repayment schedule. This can override individual segment settings.</param>
    public sealed record PiecewiseInput
    (
        decimal InitialLoanAmount,
        IReadOnlyList<PiecewiseSegmentInput> Segments,
        bool GenerateSchedule = true
    );
}
