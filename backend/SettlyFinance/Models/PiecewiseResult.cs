using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Represents the calculated result of a piecewise loan, including summary totals and the optional repayment schedule.
    /// </summary>
    /// <param name="InitialLoanAmount">The original loan principal.</param>
    /// <param name="TotalPrincipal">The total principal paid over the life of the loan. Should match the initial amount.</param>
    /// <param name="TotalInterest">The total amount of interest paid over the life of the loan.</param>
    /// <param name="TotalCost">The total cost of the loan (TotalPrincipal + TotalInterest).</param>
    /// <param name="TotalPeriods">The total number of repayment periods across all segments.</param>
    /// <param name="Schedule">The detailed repayment schedule, which will be null if schedule generation was disabled.</param>
    public sealed record PiecewiseResult(
        decimal InitialLoanAmount,
        decimal TotalPrincipal,
        decimal TotalInterest,
        decimal TotalCost,
        int TotalPeriods,
        IReadOnlyList<PiecewiseScheduleRow>? Schedule
    );
}
