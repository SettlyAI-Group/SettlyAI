using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinance.Utils;
using SettlyFinance.Enums;
namespace SettlyFinance.Calculators.Engines
{
    public sealed class IoEngine: IAmortizationEngine
    {
        private readonly IFrequencyProvider _frequencyProvider;
        public IoEngine(IFrequencyProvider frequencyProvider)
        {
            _frequencyProvider = frequencyProvider;
        }
        public AmortizationResult Calculate(AmortizationInput input)
        {
            if (input.TermPeriods <= 0)
                throw new ArgumentOutOfRangeException(nameof(input.TermPeriods), "Term periods must be positive.");
            if (input.AnnualInterestRate < 0m)
    throw new ArgumentOutOfRangeException(nameof(input.AnnualInterestRate), "Rate cannot be negative.");
            if (_frequencyProvider.GetPeriodsPerYear(input.Frequency) <= 0) throw new ArgumentOutOfRangeException(nameof(input.Frequency), "Frequency must be valid.");
if (input.Type != RepaymentType.InterestOnly) throw new InvalidOperationException("IO engine only supports InterestOnly repayment type.");
            var periodsPerYear = _frequencyProvider.GetPeriodsPerYear(input.Frequency);
            var r = (periodsPerYear == 0) ? 0m : input.AnnualInterestRate / periodsPerYear;
            long principalCents = MoneyUtils.ToCents(input.LoanAmount);
            long paymentCents = (r == 0m) ? 0L : (long)Math.Round(principalCents * r, 0, MidpointRounding.AwayFromZero);
            var scheduleList = input.GenerateSchedule
                ? new List<AmortizationScheduleRow>(input.TermPeriods)
                : null;
            long totalInterest;
            long totalPaid;
            if (!input.GenerateSchedule)
            {
                totalInterest = paymentCents * input.TermPeriods;
                totalPaid = totalInterest;
            }
            else
            {
                totalInterest = 0;
                totalPaid = 0;
                for (int k = 1; k <= input.TermPeriods; k++)
                {
                    long interestCents = paymentCents;
                    long paidThis = interestCents;
                    totalInterest += interestCents;
                    totalPaid += paidThis;
                    scheduleList!.Add(new AmortizationScheduleRow(
                        Period: k,
                        Payment: MoneyUtils.FromCents(paidThis),
                        Interest: MoneyUtils.FromCents(interestCents),
                        Principal: 0m,
                        EndingBalance: MoneyUtils.FromCents(principalCents)));
                }
            }
            decimal precisePayment = MoneyUtils.FromCents(paymentCents);
            int displayPayment = (int)Math.Ceiling(precisePayment);
            return new AmortizationResult(
                LoanAmount: input.LoanAmount,
                AnnualInterestRate: input.AnnualInterestRate,
                Frequency: input.Frequency,
                RepaymentType: input.Type,
                Payment: precisePayment,
                DisplayPayment: displayPayment,
                TotalInterest: MoneyUtils.FromCents(totalInterest),
                TotalPrincipal: 0m,
                TotalCost: MoneyUtils.FromCents(totalPaid),
                TermPeriods: input.TermPeriods,
                Schedule: scheduleList
            );
        }
    }
}
