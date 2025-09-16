using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Models;

namespace SettlyFinance.Interfaces
{
    /// <summary>
    /// Base contract for an amortization engine.
    /// </summary>
    public interface IAmortizationEngine
    {
        /// <summary>
        /// Calculates repayment metrics for a continuous block.
        /// </summary>
        /// <param name="input">The consolidated input parameters for the calculation.</param>
        Pniresult Calculate (PniInput input);
    }
}
