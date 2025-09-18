namespace SettlyFinance.Models
{
    /// <summary>
    /// Aggregated result for a Principal & Interest (amortization) calculation.
    /// Monetary values are expressed in AUD (decimal) rounded to 2 dp by the engine.
    /// </summary>
    public sealed record PniResult
    (
        /// <summary>
        /// Fixed repayment per period (in AUD).
        /// For piecewise cases, this is the first segment's payment.
        /// </summary>
        decimal Payment,
        int DisplayPayment,
        /// <summary>
        /// Total interest paid for this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        decimal TotalInterest,
        /// <summary>
        /// Total cost for this result (Principal + TotalInterest).
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        decimal TotalCost,
        /// <summary>
        /// Total number of periods in this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        int TermPeriods,
        /// <summary>
        /// Optional full amortization schedule.
        /// Can be null when caller disables schedule generation for performance.
        /// </summary>
        IReadOnlyList<PniScheduleRow>? Schedule
    );
}
