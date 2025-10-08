using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyFinance.Interfaces
{
    public interface IFrequencyProvider
    {
        /// <summary>
        /// Gets the number of repayment periods per year for a given repayment frequency.
        /// </summary>
        /// <param name="frequency">The repayment frequency (e.g., "monthly", "fortnightly", "weekly").</param>
        /// <returns>The number of periods per year (12, 26, 52).</returns>
        int GetPeriodsPerYear(RepaymentFrequency frequency);
    }
}
