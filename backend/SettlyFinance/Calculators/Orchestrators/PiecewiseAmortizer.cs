using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinance.Utils;

namespace SettlyFinance.Calculators.Orchestrators
{
    /// <summary>
    /// Orchestrates mixed IO/PNI segments. Each segment starts with the
    /// previous segment's ending balance as its principal (loan amount).
    /// </summary>
    public sealed class PiecewiseAmortizer :IPiecewiseAmortizer
    {
        private readonly IAmortizationEngineFactory _factory;
        public PiecewiseAmortizer(IAmortizationEngineFactory factory)
            => _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        public PiecewiseResult Calculate (PiecewiseInput input)
        {
            if (input.InitialLoanAmount <= 0m) throw new ArgumentOutOfRangeException(nameof(input.InitialLoanAmount), "Initial loan must be positive.");
            if (input.Segments is null || input.Segments.Count == 0)
                throw new ArgumentException("At least one segment is required.", nameof(input.Segments));
            var generateSchedule = input.GenerateSchedule;
            var schedule = generateSchedule ? new List<PiecewiseScheduleRow>() : null;
            decimal currentPrincipal = input.InitialLoanAmount;
            decimal totalInterest = 0m;
            decimal totalPrincipal = 0m;
            int globalPeriod = 0;
            decimal firstSegmentPayment = 0m;
            for (int i = 0; i < input.Segments.Count; i++)
            {
                var seg = input.Segments[i];
                var segInput = new AmortizationInput(
                   LoanAmount: currentPrincipal,
                   AnnualInterestRate: seg.AnnualInterestRate,
                   TermPeriods: seg.TermPeriods,
                   Frequency: seg.Frequency,
                   GenerateSchedule: generateSchedule && seg.GenerateSchedule,
                   RepaymentType: seg.RepaymentType
               );
                var engine = _factory.GetEngine(seg.RepaymentType);
                var segResult = engine.Calculate(segInput);
                if (i == 0)
                {
                    firstSegmentPayment = segResult.Payment;
                }
                totalInterest += segResult.TotalInterest;
                totalPrincipal += segResult.TotalPrincipal;
                //var nextPrincipal = currentPrincipal - segResult.TotalPrincipal;
                if (generateSchedule && segResult.Schedule is not null)
                {
                    for (int k = 0; k < segResult.Schedule.Count; k++)
                    {
                        var row = segResult.Schedule[k];
                        schedule!.Add(new PiecewiseScheduleRow(
                            GlobalPeriod: ++globalPeriod,
                            SegmentIndex: i,
                            SegmentPeriod: k + 1,
                            Payment: row.Payment,
                            Interest: row.Interest,
                            Principal: row.Principal,
                            EndingBalance: row.EndingBalance,
                            SegmentLabel: seg.Label));
            }
    }
                else
                {
                    globalPeriod += seg.TermPeriods;
                }
                //currentPrincipal = nextPrincipal;
                currentPrincipal = segResult.EndingBalance;
            }
            var totalCost = Math.Round(totalPrincipal + totalInterest, 2);
            var result = new PiecewiseResult(
                InitialLoanAmount: input.InitialLoanAmount,
                TotalPrincipal: Math.Round(totalPrincipal, 2),
                TotalInterest: Math.Round(totalInterest, 2),
                TotalCost: totalCost,
                TotalPeriods: globalPeriod,
                Schedule: schedule,
                FirstSegmentPayment: firstSegmentPayment
            );
            return result;
        }
    }
}
