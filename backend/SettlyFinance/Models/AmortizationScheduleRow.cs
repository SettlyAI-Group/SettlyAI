using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace SettlyFinance.Models
{
    /// <summary>
    /// A single amortization line item for a given period.
    /// All monetary values in AUD (decimal), rounded to 2 dp by the engine.
    /// </summary>
    public readonly record struct AmortizationScheduleRow(
        /// <summary>1-based period index (e.g., 1..360).</summary>
        int Period,
        /// <summary>Amount paid this period (in AUD). For the last period, may differ by 0.01 due to tail adjustment.</summary>
        decimal Payment,
        /// <summary>Interest portion of this period (in AUD).</summary>
        decimal Interest,
        /// <summary>Principal portion of this period (in AUD).</summary>
        decimal Principal,
        /// <summary>EndingBalance principal after this period (in AUD).</summary>
        decimal EndingBalance
    );
}
