using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyFinance.Interfaces
{
    /// <summary>Return the concrete engine for the given repayment type.</summary>
    public interface IAmortizationEngineFactory
    {
        IAmortizationEngine GetEngine(RepaymentType type);
    }
}
