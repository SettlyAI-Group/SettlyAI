using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyFinance.Models
{
    /// <summary>
    /// Input parameters for a single, continuous amortization block.
    /// </summary>
    public record PniInput
    (
        /// <summary>Principal amount in AUD (decimal).</summary>
        decimal LoanAmount,
        /// <summary>Annual nominal rate in decimal form (e.g., 0.0584 for 5.84%).</summary>
        decimal AnnualInterestRate,
        /// <summary>
        /// Number of periods (not years) in this specific block.
        /// (e.g., 60 for a 5-year IO segment, 300 for a 25-year P&I segment).
        /// </summary>
        int TermPeriods,
        /// <summary>Repayment frequency enum.</summary>
        RepaymentFrequency Frequency,
        /// <summary>Whether to generate the full amortization schedule.</summary>
        bool WithSchedule = false
    );
}
