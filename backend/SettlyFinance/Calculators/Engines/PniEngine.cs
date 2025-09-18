using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinance.Enums;
using SettlyFinance.Utils;
using Excel.FinancialFunctions;
namespace SettlyFinance.Calculators.Engines
{
    /// <summary>
    /// Principal & Interest amortization engine (annuity):
    /// payment = P * r / (1 - (1 + r)^-n)
    /// r = annualRate / periodsPerYear; n = total periods.
    /// Zero-rate fallback: evenly split principal to cents.
    /// </summary>
    public sealed class PniEngine: IAmortizationEngine
    {
        private readonly IFrequencyProvider _frequencyProvider;
        public PniEngine(IFrequencyProvider frequencyProvider)
        {
            _frequencyProvider = frequencyProvider;
        }
        /// <summary>
        /// Calculates repayment metrics for a continuous block (does not cross segments).
        /// </summary>
        /// <param name="input">The consolidated input parameters for the calculation.</param>
        public PniResult Calculate (PniInput input)
        {
            if (input.TermPeriods <= 0) throw new ArgumentOutOfRangeException(nameof(input.TermPeriods), "Term periods must be positive");
            var periodsPerYear = _frequencyProvider.GetPeriodsPerYear(input.Frequency);      // 12 / 26 / 52
            var r = (periodsPerYear == 0) ? 0m : input.AnnualInterestRate / periodsPerYear;
            var P = MoneyUtils.ToCents(input.LoanAmount);
            long paymentCents;
            if (input.AnnualInterestRate == 0m || r == 0m)
            {
                //If annual interest rate equals zero, the payment equals loan amount divided by term periods.
                paymentCents = (long)Math.Round((decimal)P / input.TermPeriods, 0, MidpointRounding.AwayFromZero);
            }
            else
            {
                double paymentInDollars = Financial.Pmt(
                rate: (double)r,
                nper: input.TermPeriods,
                pv: (double)input.LoanAmount,
                fv: 0,
                typ: PaymentDue.EndOfPeriod);
                decimal paymentDecimal = (decimal)Math.Abs(paymentInDollars);
                paymentCents = MoneyUtils.ToCents(paymentDecimal);
            }
            //Initialize tracking variables for the amortization loop.
            long remaining = P;
            long totalPaid = 0;
            long totalInterest = 0;
            var scheduleList = input.WithSchedule ? new List<PniScheduleRow>(input.TermPeriods) : null;
            for (int k = 1; k <= input.TermPeriods; k++)
            {
                bool isLast = (k == input.TermPeriods);
                long interestCents = (long)Math.Round(remaining * r, 0, MidpointRounding.AwayFromZero);
                long suggestedPrincipal = paymentCents - interestCents;
                long principalPart = MoneyUtils.FixPrincipalPart(remaining, suggestedPrincipal, isLast);
                long nextRemaining = MoneyUtils.ReduceRemainingPrincipal(remaining, principalPart);
                long paidThis = isLast ? (principalPart + interestCents) : paymentCents;
                totalPaid = totalPaid + paidThis;
                totalInterest = totalInterest + interestCents;
                remaining = nextRemaining;
                if (input.WithSchedule)
                {
                    scheduleList!.Add(new PniScheduleRow(
                        Period: k,
                        Payment: MoneyUtils.FromCents(paidThis),
                        Interest: MoneyUtils.FromCents(interestCents),
                        Principal: MoneyUtils.FromCents(principalPart),
                        Remaining: MoneyUtils.FromCents(remaining)
                    ));
                }
            }
            decimal precisePayment = MoneyUtils.FromCents(paymentCents);
            int displayPayment = (int)Math.Ceiling(precisePayment);
            return new PniResult(
                 Payment: precisePayment,          
        DisplayPayment: displayPayment,
                TotalInterest: MoneyUtils.FromCents(totalInterest),
                TotalCost: MoneyUtils.FromCents(totalPaid),
                TermPeriods: input.TermPeriods,
                Schedule: scheduleList);
        }
    }
}
