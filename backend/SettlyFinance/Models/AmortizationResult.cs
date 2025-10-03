using SettlyFinance.Enums;
namespace SettlyFinance.Models
{
    /// <summary>
    /// Represents the result of a single amortization block calculation.
    /// This is a generic model that can hold results for P&I, IO, or other repayment types.
    /// Monetary values are in AUD (decimal) rounded to 2 decimal places.
    /// </summary>
    public sealed record AmortizationResult
    (
        decimal LoanAmount,
        decimal AnnualInterestRate,
        RepaymentFrequency Frequency,
        RepaymentType RepaymentType,
        /// <summary>
        /// Fixed repayment per period (in AUD).
        /// For piecewise cases, this is the first segment's payment.
        /// </summary>
        decimal Payment,
        // int DisplayPayment,
        /// <summary>
        /// Total interest paid for this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        decimal TotalInterest,
        /// <summary>Total principal paid down over the duration of this block (For IO, this will be 0).</summary>
        decimal TotalPrincipal,
        /// <summary>
        /// Total paid for this result (Principal + TotalInterest).
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        decimal TotalCost,
        /// <summary>
        /// Total number of periods in this result.
        /// (This could be for a single segment or the aggregated total horizon).
        /// </summary>
        int TermPeriods,
        /// <summary>
        /// The **exact** remaining balance (principal) at the end of this block.
        /// </summary>
        decimal EndingBalance,
        /// <summary>
        /// Optional full amortization schedule.
        /// Can be null when caller disables schedule generation for performance.
        /// </summary>
        IReadOnlyList<AmortizationScheduleRow>? Schedule
    );
}
