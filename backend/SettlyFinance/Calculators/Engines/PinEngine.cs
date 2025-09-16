using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinance.Enums;
using SettlyFinance.Utils;

namespace SettlyFinance.Calculators.Engines
{
    /// <summary>
    /// Principal & Interest amortization engine (annuity):
    /// payment = P * r / (1 - (1 + r)^-n)
    /// r = annualRate / periodsPerYear; n = total periods.
    /// Zero-rate fallback: evenly split principal to cents.
    /// </summary>
    public sealed class PinEngine: IAmortizationEngine
    {
        private readonly IFrequencyProvider _frequencyProvider;
        public PinEngine(IFrequencyProvider frequencyProvider)
        {
            _frequencyProvider = frequencyProvider;
        }
        /// <summary>
        /// Calculates repayment metrics for a continuous block (does not cross segments).
        /// </summary>
        /// <param name="input">The consolidated input parameters for the calculation.</param>
        public Pniresult Calculate (PniInput input)
        {
            if (input.TermPeriods <= 0) throw new ArgumentOutOfRangeException(nameof(input.TermPeriods), "Term periods must be positive");
            var periods 
        }
    }
}
