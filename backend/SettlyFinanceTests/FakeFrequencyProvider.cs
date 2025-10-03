using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;

namespace SettlyFinanceTests
{
    /// <summary>
    /// A fake implementation of <see cref="IFrequencyProvider"/> for testing purposes.
    /// This allows setting a fixed number of periods per year for any given repayment frequency.
    /// </summary>
    public sealed class FakeFrequencyProvider: IFrequencyProvider
    {
        private readonly int _ppy;
        /// <summary>
        /// Initializes a new instance of the <see cref="FakeFrequencyProvider"/> class.
        /// </summary>
        /// <param name="periodsPerYear">The fixed number of periods per year this provider will return for all frequencies.</param>
        public FakeFrequencyProvider(int periodsPerYear) => _ppy = periodsPerYear;
        /// <summary>
        /// Gets the fixed number of periods per year that was set during construction,
        /// ignoring the provided repayment frequency.
        /// </summary>
        public int GetPeriodsPerYear(RepaymentFrequency _) => _ppy;
    }
}
