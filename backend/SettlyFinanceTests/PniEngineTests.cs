using System;
using System.Linq;
using System.Collections.Generic;
using SettlyFinance.Calculators;
using SettlyFinance.Calculators.Engines;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using Xunit;
using SettlyFinanceTests;
using SettlyFinanceTests.Helpers;
namespace SettlyFinance.Tests.Calculators.Engines
{
    /// <summary>
    /// Unit tests for <see cref="PniEngine"/>.
    /// Verifies that amortization with Principal &amp; Interest (P&amp;I) 
    /// repayments follows financial math invariants under different scenarios.
    /// </summary>
    public class PniEngineTests
    {
        /// <summary>
        /// Ensures that <see cref="PniEngine.Calculate"/> 
        /// throws an exception when term periods are not positive.
        /// </summary>
        [Fact]
        public void Calculate_Throws_When_TermPeriods_NotPositive()
        {
            var engine = new PniEngine(new FakeFrequencyProvider(12));
            var input = new PniInputBuilder()
                .Loan(1000m).Rate(0.05m).Periods(0).Freq(RepaymentFrequency.Monthly).WithSchedule(false)
                .Build();

            Assert.Throws<ArgumentOutOfRangeException>(() => engine.Calculate(input));
        }
        /// <summary>
        /// When interest rate is zero, repayment evenly splits principal 
        /// across all periods with no interest charged.
        /// </summary>
        [Fact]
        public void Calculate_ZeroRate_EvenlySplitsPrincipal_NoSchedule()
        {
            const decimal loan = 1000m;
            const int periods = 10;
            var engine = new PniEngine(new FakeFrequencyProvider(12));
            var input = new PniInputBuilder()
                .Loan(loan).Rate(0m).Periods(periods).Freq(RepaymentFrequency.Monthly).WithSchedule(false)
                .Build();
            var result = engine.Calculate(input);
            Assert.Equal(100m, result.Payment); // 1000 / 10
            Assert.Equal(0m, result.TotalInterest);
            Assert.Equal(loan, result.TotalCost);
            Assert.Equal(periods, result.TermPeriods);
            Assert.Null(result.Schedule);
        }
        ///<summary>
        /// Verifies core invariants for non-zero rate loans, 
        /// including golden payment values, schedule length, 
        /// balance progression, and interest summation.
        /// </summary>
        [Theory]
        // loanAmount, annualRate, periodsPerYear, termPeriods, expectedPrecisePayment, expectedDisplayPayment
        [InlineData(100_000, 0.06, 12, 360, 599.55)]   // 100k, 6%, Monthly, 30y
        [InlineData(350_000, 0.0584, 12, 300, 2220.95)]   // 350k, 5.84%, Monthly, 25y
        [InlineData(500_000, 0.065, 26, 260, 2617.63)]   // 500k, 6.5%, Fortnightly, 10y
        public void Calculate_NonZeroRate_CoreInvariants_Hold(
            decimal loanAmount,
            decimal annualRate,
            int periodsPerYear,
            int termPeriods,
            decimal expectedPrecisePayment
            // int expectedDisplayPayment
            )
        {
            var engine = new PniEngine(new FakeFrequencyProvider(periodsPerYear));
            var input = new PniInputBuilder()
                .Loan(loanAmount).Rate(annualRate).Periods(termPeriods).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                .Build();
            var result = engine.Calculate(input);
            // 1) Payment matches "Golden Value"
            Assert.Equal(expectedPrecisePayment, result.Payment);
            // Assert.Equal(expectedDisplayPayment, result.DisplayPayment);
            // 2) Schedule length
            Assert.NotNull(result.Schedule);
            Assert.Equal(termPeriods, result.Schedule!.Count);
            // 3)  Sum of principal repayments equals original loan amount.
            var sumPrincipal = result.Schedule.Sum(r => r.Principal);
            Assert.Equal(loanAmount, Math.Round(sumPrincipal, 2));
            // 4) Sum of interest repayments equals TotalInterest.
            var sumInterest = result.Schedule.Sum(r => r.Interest);
            Assert.Equal(result.TotalInterest, Math.Round(sumInterest,2));
            // 5) Total cost matches principal + interest.
            Assert.Equal(result.TotalCost, loanAmount + result.TotalInterest);
            // 6) Ending balance is zero
            var lastRemaining = result.Schedule.Last().EndingBalance;
            Assert.Equal(0m, lastRemaining);
            // 7) Balance non-increasing
            for (int i = 1; i < result.Schedule.Count; i++)
            {
                Assert.True(result.Schedule[i].EndingBalance <= result.Schedule[i - 1].EndingBalance,
                    $"EndingBalance should be non-increasing at period {i + 1}");
            }
            // 8) Payments are constant except possibly the last one.
            for (int i = 0; i < result.Schedule.Count - 1; i++)
            {
                Assert.Equal(result.Payment, result.Schedule[i].Payment);
            }
        }
        /// <summary>
        /// Ensures that generated schedule rows are reasonable:
        /// first row has valid breakdown, last row has zero balance.
        /// </summary>
        [Fact]
        public void Calculate_WithSchedule_FillsReasonableRows()
        {
            var engine = new PniEngine(new FakeFrequencyProvider(52)); // Weekly
            var input = new PniInputBuilder()
                .Loan(50_000m).Rate(0.07m).Periods(104).Freq(RepaymentFrequency.Weekly).WithSchedule(true)
                .Build();
            var result = engine.Calculate(input);
            Assert.NotNull(result.Schedule);
            var first = result.Schedule!.First();
            var last = result.Schedule!.Last();
            Assert.True(first.Payment > 0m);
            Assert.True(first.Interest >= 0m);
            Assert.True(first.Principal > 0m);
            Assert.True(first.EndingBalance < input.LoanAmount);
            Assert.Equal(0m, last.EndingBalance);
        }
        /// <summary>
        /// Confirms that the periodic interest rate used 
        /// comes directly from <see cref="FakeFrequencyProvider"/>.
        /// </summary>
        [Fact]
        public void Calculate_UsesFrequencyProvider_ForPeriodRate()
        {
            var loan = 200_000m;
            var annual = 0.06m;
            var periods = 120;

            var monthlyEngine = new PniEngine(new FakeFrequencyProvider(12));
            var monthlyPayment = monthlyEngine.Calculate(
                new PniInputBuilder().Loan(loan).Rate(annual).Periods(periods).Freq(RepaymentFrequency.Monthly).WithSchedule(false).Build()
            ).Payment;

            var weeklyEngine = new PniEngine(new FakeFrequencyProvider(52));
            var weeklyPayment = weeklyEngine.Calculate(
                new PniInputBuilder().Loan(loan).Rate(annual).Periods(periods).Freq(RepaymentFrequency.Weekly).WithSchedule(false).Build()
            ).Payment;
            // With more periods per year, r is smaller, so the payment must be smaller
            Assert.True(weeklyPayment < monthlyPayment);
        }
    }
}
