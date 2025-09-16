using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Utils
{
    public static class MoneyUtils
    {
        // AUD → Cents (integer), ensure precision and avoid floating point errors.
        public static long ToCents(decimal amount) =>
            (long)Math.Round(amount * 100m, 0, MidpointRounding.AwayFromZero);
        // Cents → AUD (decimal), used for API/frontend display.
        public static decimal FromCents(long cents) =>
            cents / 100m;
        //Round to 2 decimal places (cents) using AwayFromZero rule.
        public static decimal RoundToCent(decimal amount) =>
            Math.Round(amount, 2, MidpointRounding.AwayFromZero);
        //Tail adjustment: in the final installment, principal part must equal remaining balance to ensure zero outstanding.
        /// <summary>
        /// Corrects a suggested principal payment amount to ensure it adheres to business logic.
        /// </summary>
        /// <param name="remainingPrincipalCents">The remaining principal balance of the loan, in cents.</param>
        /// <param name="suggestedPrincipalPart">The suggested principal amount to be paid in this installment, in cents.</param>
        /// <param name="isLastInstallment">A flag indicating whether this is the final loan installment.</param>
        /// <returns>Returns the corrected and finalized principal amount to be paid.</returns>
        public static long FixPrincipalPart(long remainingPrincipalCents, long suggestedPrincipalPart, bool isLastInstallment)
        {
            // If the remaining principal is negative, the data is invalid.
            if (remainingPrincipalCents < 0)
                throw new ArgumentOutOfRangeException(nameof(remainingPrincipalCents),"Remaining principal must be non-negative.");
            // If it's the last installment, the entire remaining principal must be paid.
            if (isLastInstallment ) return remainingPrincipalCents;
            //For non-final installments, never allow negative or over-application.
            var effectivePrincipalPart = Math.Clamp(suggestedPrincipalPart, 0L, remainingPrincipalCents);
            return effectivePrincipalPart;
        }
        /// <summary>
        /// Reduces the remaining principal balance of a loan by a specified payment amount.
        /// </summary>
        /// <param name="remainingPrincipalCents">The current remaining principal balance of the loan, in cents.</param>
        /// <param name="principalCents">The principal payment amount to be deducted, in cents.</param>
        /// <returns>Returns the new remaining principal balance after the payment has been applied.</returns>
        public static long ReduceRemainingPrincipal(long remainingPrincipalCents, long principalCents)
        {
            // If the remaining principal is negative, the data is invalid.
            if (remainingPrincipalCents < 0) throw new ArgumentOutOfRangeException(nameof(remainingPrincipalCents), "Remaining principal must be non-negative.");
            // Ensure the payment amount is valid by clamping it between 0 and the current remaining principal.
            var principalPaidCents = Math.Clamp(principalCents, 0L, remainingPrincipalCents);
            // Subtract the actual payment from the remaining principal to get the new balance.
            return remainingPrincipalCents - principalPaidCents;
        }
    }
}
