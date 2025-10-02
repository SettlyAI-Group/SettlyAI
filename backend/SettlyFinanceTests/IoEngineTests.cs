using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Calculators.Engines;
using SettlyFinance.Enums;
using SettlyFinanceTests.Helpers;

namespace SettlyFinanceTests
{
    /// <summary>
    /// Unit tests for the <see cref="IoEngine"/>.
    /// These tests validate the behavior of Interest-Only amortization calculations,
    /// ensuring correct payment amounts, schedule generation, and total cost consistency.
    /// </summary>
    public class IoEngineTests
    {
        /// <summary>
        /// Ensures that the engine throws an <see cref="ArgumentOutOfRangeException"/>
        /// if the number of term periods is zero or negative.
        /// </summary>
        [Fact]
        public void Calculate_Throws_When_TermPeriods_NotPositive()
        {
            var engine = new IoEngine(new FakeFrequencyProvider(12));
            var input = new IoInputBuilder()
                .Loan(1000m).Rate(0.05m).Periods(0).Freq(RepaymentFrequency.Monthly).WithSchedule(false)
                .Build();
            Assert.Throws<ArgumentOutOfRangeException>(() => engine.Calculate(input));
        }
        /// <summary>
        /// Verifies that when the annual interest rate is zero and schedule is not requested,
        /// all outputs are zero (no payments, no interest, no principal).
        /// </summary>
        [Fact]
        public void Calculate_ZeroRate_NoSchedule_AllZeroes()
        {
            var engine = new IoEngine(new FakeFrequencyProvider(12));
            var input = new IoInputBuilder()
                .Loan(200_000m).Rate(0m).Periods(36).Freq(RepaymentFrequency.Monthly).WithSchedule(false)
                .Build();
            var result = engine.Calculate(input);
            Assert.Equal(0m, result.Payment);
            // Assert.Equal(0m, result.DisplayPayment);
            Assert.Equal(0m, result.TotalInterest);
            Assert.Equal(0m, result.TotalPrincipal);
            Assert.Equal(0m, result.TotalCost);
            Assert.Null(result.Schedule);
        }
        /// <summary>
        /// Verifies that for non-zero interest rates, each payment equals
        /// principal × periodic rate, rounded appropriately. Also validates
        /// that the schedule structure is correct and consistent.
        /// </summary>
        [Theory]
        // loan, rate, ppy, n, expected precise payment (Round(P * rate/ppy)), expected display
        [InlineData(500_000, 0.065, 12, 36, 2708.33)]   // Monthly
        [InlineData(300_000, 0.05, 26, 78, 576.92)]      // Fortnightly
        public void Calculate_Payment_Equals_P_times_r_Rounded(
            decimal loanAmount,
            decimal annualRate,
            int periodsPerYear,
            int termPeriods,
            decimal expectedPrecisePayment
            // int expectedDisplayPayment
            )
        {
            var engine = new IoEngine(new FakeFrequencyProvider(periodsPerYear));
            var input = new IoInputBuilder()
                .Loan(loanAmount).Rate(annualRate).Periods(termPeriods).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                .Build();
            var result = engine.Calculate(input);
            // 1) Each periodic payment matches the expected rounded value
            Assert.Equal(expectedPrecisePayment, result.Payment);
            // Assert.Equal(expectedDisplayPayment, result.DisplayPayment);
            // 2) Schedule contains the correct number of periods
            Assert.NotNull(result.Schedule);
            Assert.Equal(termPeriods, result.Schedule!.Count);
            // 3) In IO loans, all principal parts are zero and balance never decreases
            Assert.All(result.Schedule!, r => Assert.Equal(0m, r.Principal));
            Assert.All(result.Schedule!, r => Assert.Equal(loanAmount, r.EndingBalance));
            // 4) Total cost equals total interest (no principal repayments)
            Assert.Equal(result.TotalInterest, result.TotalCost);
            // 5) The sum of all interest in the schedule matches TotalInterest
            var sumInterest = result.Schedule.Sum(r => r.Interest);
            Assert.Equal(result.TotalInterest, Math.Round(sumInterest,2));
            // 6) Every payment in the schedule equals the Payment property
            Assert.All(result.Schedule!, r => Assert.Equal(result.Payment, r.Payment));
        }
        /// <summary>
        /// Ensures consistency between schedule and no-schedule modes:
        /// when GenerateSchedule=false, the computed TotalInterest must equal
        /// the sum of interests in a generated schedule for the same loan.
        /// </summary>
        [Fact]
        public void Calculate_WithScheduleFalse_Equals_Schedule_Sum()
        {
            var loan = 150_000m;
            var rate = 0.045m;
            var n = 52; // 1 year weekly
            var engine = new IoEngine(new FakeFrequencyProvider(52));
            // A) With schedule
            var withSch = engine.Calculate(new IoInputBuilder()
                .Loan(loan).Rate(rate).Periods(n).Freq(RepaymentFrequency.Weekly).WithSchedule(true)
                .Build());
            var sumInterest = withSch.Schedule!.Sum(r => r.Interest);
            // B) Without schedule
            var noSch = engine.Calculate(new IoInputBuilder()
                .Loan(loan).Rate(rate).Periods(n).Freq(RepaymentFrequency.Weekly).WithSchedule(false)
                .Build());
            Assert.Equal(Math.Round(sumInterest, 2), noSch.TotalInterest);
            Assert.Equal(noSch.TotalInterest, noSch.TotalCost);
        }
        [Fact]
        public void Calculate_UsesFrequencyProvider_ForPeriodicRate()
        {
            var loan = 200_000m;
            var annual = 0.06m;
            var periods = 120;
            var monthlyEngine = new IoEngine(new FakeFrequencyProvider(12));
            var monthlyPay = monthlyEngine.Calculate(new IoInputBuilder()
                .Loan(loan).Rate(annual).Periods(periods).Freq(RepaymentFrequency.Monthly).WithSchedule(false)
                .Build()).Payment;
            var weeklyEngine = new IoEngine(new FakeFrequencyProvider(52));
            var weeklyPay = weeklyEngine.Calculate(new IoInputBuilder()
                .Loan(loan).Rate(annual).Periods(periods).Freq(RepaymentFrequency.Weekly).WithSchedule(false)
                .Build()).Payment;
            // With more periods per year, r is smaller, so the payment must be smaller
            Assert.True(weeklyPay < monthlyPay);
        }
    }
}
