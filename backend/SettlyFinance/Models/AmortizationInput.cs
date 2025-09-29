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
    /// This can be used for both P&I and IO periods.
    /// </summary>
    public record AmortizationInput
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
        /// <summary>The type of repayment for this block (P&I or IO).</summary>
        RepaymentType RepaymentType,
        /// <summary>Whether to generate the full amortization schedule.</summary>
        bool GenerateSchedule = false
    );
}
