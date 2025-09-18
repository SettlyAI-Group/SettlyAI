using System;
using System.Linq;
using System.Collections.Generic;
using SettlyFinance.Calculators;
using SettlyFinance.Calculators.Engines;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using Xunit;
namespace SettlyFinance.Tests.Calculators.Engines
{
    /// <summary>
    /// A simple fake/stub for the frequency provider, avoiding the need for a third-party mocking library.
    /// </summary>
    internal sealed class FakeFrequencyProvider : IFrequencyProvider
    {
        private readonly int _ppy;
        public FakeFrequencyProvider(int periodsPerYear) => _ppy = periodsPerYear;
        public int GetPeriodsPerYear(RepaymentFrequency _) => _ppy;
    }
    public class PniEngineTests
    {
        #region helpers
        /// <summary>
        /// A helper method to keep test code clean by centralizing the creation of PniInput objects.
        /// </summary>
        private static PniInput MakeInput(
            decimal loanAmount,
            decimal annualRate,
            int termPeriods,
            RepaymentFrequency freq,
            bool withSchedule)
        {
            return new PniInput(
                LoanAmount: loanAmount,
                AnnualInterestRate: annualRate,
                TermPeriods: termPeriods,
                Frequency: freq,
                WithSchedule: withSchedule
            );
        }
        #endregion
        [Fact]
        public void Calculate_Throws_When_TermPeriods_NotPositive()
        {
            var engine = new PniEngine(new FakeFrequencyProvider(12));
            var input = MakeInput(loanAmount: 1000m, annualRate: 0.05m, termPeriods: 0, freq: RepaymentFrequency.Monthly, withSchedule: false);

            Assert.Throws<ArgumentOutOfRangeException>(() => engine.Calculate(input));
        }
        [Fact]
        public void Calculate_ZeroRate_EvenlySplitsPrincipal_NoSchedule()
        {
            const decimal loan = 1000m;
            const int periods = 10;
            var engine = new PniEngine(new FakeFrequencyProvider(12));
            var input = MakeInput(loan, annualRate: 0m, termPeriods: periods, freq: RepaymentFrequency.Monthly, withSchedule: false);

            var result = engine.Calculate(input);

            // Assert against the "Golden Value" (1000 / 10 = 100).
            Assert.Equal(100m, result.Payment);
            Assert.Equal(0m, result.TotalInterest);
            Assert.Equal(loan, result.TotalCost);
            Assert.Equal(periods, result.TermPeriods);
            Assert.Null(result.Schedule);
        }
        [Theory]
        // Add the expectedPayment as a "Golden Value" to the test data.
        // These values were calculated independently using a standard financial formula.
        // Format: loanAmount, annualRate, periodsPerYear, termPeriods, expectedPrecisePayment, expectedDisplayPayment
        [InlineData(100_000, 0.06, 12, 360, 599.55, 600)]  // 100k, 6%,   Monthly, 30y
        [InlineData(350_000, 0.0584, 12, 300, 2220.95, 2221)] // 350k, 5.84%, Monthly, 25y
        [InlineData(500_000, 0.065, 26, 260, 2617.63, 2618)] // 500k, 6.5%, Fortnightly, 10y
        public void Calculate_NonZeroRate_CoreInvariants_Hold(
          decimal loanAmount,
          decimal annualRate,
          int periodsPerYear,
          int termPeriods,
          decimal expectedPrecisePayment,
          int expectedDisplayPayment)  // The Golden Value is passed in here
        {
            var engine = new PniEngine(new FakeFrequencyProvider(periodsPerYear));
            var input = MakeInput(loanAmount, annualRate, termPeriods, RepaymentFrequency.Monthly, withSchedule: true);
            var result = engine.Calculate(input);
            // 1) Payment matches the independently verified "Golden Value".
            Assert.Equal(expectedPrecisePayment, result.Payment);
            Assert.Equal(expectedDisplayPayment, result.DisplayPayment);
            // 2) Schedule length is correct.
            Assert.NotNull(result.Schedule);
            Assert.Equal(termPeriods, result.Schedule!.Count);
            // 3) The sum of all principal payments equals the original loan amount.
            var sumPrincipal = result.Schedule.Sum(r => r.Principal);
            Assert.Equal(loanAmount, Math.Round(sumPrincipal, 2));
            // 4) The sum of all interest payments in the schedule equals the TotalInterest property.
            var sumInterest = result.Schedule.Sum(r => r.Interest);
            Assert.Equal(result.TotalInterest, Math.Round(sumInterest, 2));
            Assert.Equal(result.TotalCost, Math.Round(loanAmount + result.TotalInterest, 2));
            // 5) The final remaining balance is zero.
            var lastRemaining = result.Schedule.Last().Remaining;
            Assert.Equal(0m, lastRemaining);
            // 6) The remaining balance is always decreasing or staying the same.
            for (int i = 1; i < result.Schedule.Count; i++)
            {
                Assert.True(result.Schedule[i].Remaining <= result.Schedule[i - 1].Remaining,
                    $"Remaining should be non-increasing at period {i + 1}");
            }
            // 7) Every payment except the last one should be equal.
            for (int i = 0; i < result.Schedule.Count - 1; i++)
            {
                Assert.Equal(result.Payment, result.Schedule[i].Payment);
            }
        }
        [Fact]
        public void Calculate_WithSchedule_FillsReasonableRows()
        {
            var engine = new PniEngine(new FakeFrequencyProvider(52)); // Weekly
            var input = MakeInput(loanAmount: 50_000m, annualRate: 0.07m, termPeriods: 104, freq: RepaymentFrequency.Weekly, withSchedule: true);
            var result = engine.Calculate(input);
            Assert.NotNull(result.Schedule);
            var first = result.Schedule!.First();
            var last = result.Schedule!.Last();
            // Sanity checks on the first row
            Assert.True(first.Payment > 0m);
            Assert.True(first.Interest >= 0m);
            Assert.True(first.Principal > 0m);
            Assert.True(first.Remaining < input.LoanAmount);
            // The final balance must be zero.
            Assert.Equal(0m, last.Remaining);
        }
        [Fact]
        public void Calculate_UsesFrequencyProvider_ForPeriodRate()
        {
            // This test proves that the engine correctly uses the periodsPerYear from the provider.
            var loan = 200_000m;
            var annual = 0.06m;
            var periods = 120; // 10 years, but the number of periods is fixed
            var monthlyEngine = new PniEngine(new FakeFrequencyProvider(12));
            var monthlyPayment = monthlyEngine.Calculate(MakeInput(loan, annual, periods, RepaymentFrequency.Monthly, false)).Payment;
            var weeklyEngine = new PniEngine(new FakeFrequencyProvider(52));
            var weeklyPayment = weeklyEngine.Calculate(MakeInput(loan, annual, periods, RepaymentFrequency.Weekly, false)).Payment;
            // A weekly-compounding loan will have a smaller periodic interest rate (r) than a monthly one.
            // For the same number of periods (n), a smaller r results in a smaller payment.
            Assert.True(weeklyPayment < monthlyPayment);
        }
    }
}
