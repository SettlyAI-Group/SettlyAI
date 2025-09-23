using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Enums
{
    /// <summary>
    /// Defines the type of repayment for an amortization block.
    /// </summary>
    public enum RepaymentType
    {
        /// <summary>
        /// Repayments include both principal and interest.
        /// </summary>
        PrincipalAndInterest,
        /// <summary>
        /// Repayments cover only the interest accrued.
        /// </summary>
        InterestOnly
    }
}
