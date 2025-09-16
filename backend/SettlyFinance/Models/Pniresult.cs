using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Aggregated result for a Principal & Interest (amortization) calculation.
    /// Monetary values are expressed in AUD (decimal) rounded to 2 dp by the engine.
    /// </summary>
    public sealed class Pniresult
    {
        /// <summary>
        /// Fixed repayment per period (in AUD).
        /// For piecewise cases, this is the first segment's payment.
        /// </summary>
        public decimal Payment { get; }
        /// <summary>
        /// Total interest paid for this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        public decimal TotalInterest {  get; }
        /// <summary>
        /// Total cost for this result (Principal + TotalInterest).
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        public decimal TotalCost { get; }
        /// <summary>
        /// Total number of periods in this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        public int TermPeriods { get; }
        /// <summary>
        /// Optional full amortization schedule.
        /// Can be null when caller disables schedule generation for performance.
        /// </summary>
        public IReadOnlyList<PniScheduleRow>? Schedule { get; }
    }
}
