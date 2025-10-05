using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Calculators.Orchestrators;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinanceTests.Helpers;

namespace SettlyFinanceTests
{
    public class PiecewiseAmortizerTests
    {
        private IPiecewiseAmortizer CreateAmortizer(int ppy = 12)
                   => new PiecewiseAmortizer(new TestEngineFactory(new FakeFrequencyProvider(ppy)));

        [Fact]
        public void IO_Then_PnI_AggregatesCorrectly()
        {
            var amortizer = CreateAmortizer();

            var input = new PiecewiseInput(
                InitialLoanAmount: 600000m,
                Segments: new[]
                {
            new PiecewiseSegmentInput(
                RepaymentType: RepaymentType.InterestOnly,
                AnnualInterestRate: 0.059m,
                TermPeriods: 24,
                Frequency: RepaymentFrequency.Monthly,
                GenerateSchedule: true,
                Label: "IO 24m @5.9%"
            ),
            new PiecewiseSegmentInput(
                RepaymentType: RepaymentType.PrincipalAndInterest,
                AnnualInterestRate: 0.065m,
                TermPeriods: 336,
                Frequency: RepaymentFrequency.Monthly,
                GenerateSchedule: true,
                Label: "PnI 28y @6.5%"
            )
                },
                GenerateSchedule: true
            );

            var r = amortizer.Calculate(input);

            Assert.Equal(360, r.TotalPeriods);
            Assert.NotNull(r.Schedule);
            Assert.Equal(360, r.Schedule!.Count);
            var fp = new FakeFrequencyProvider(12);
            var ioExpected = new SettlyFinance.Calculators.Engines.IoEngine(fp).Calculate(
                new SettlyFinanceTests.Helpers.IoInputBuilder()
                    .Loan(600000m).Rate(0.059m).Periods(24).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );
            var pniExpected = new SettlyFinance.Calculators.Engines.PniEngine(fp).Calculate(
                new SettlyFinanceTests.Helpers.PniInputBuilder()
                    .Loan(600000m).Rate(0.065m).Periods(336).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );
            ApproxAssert.Equal(ioExpected.Payment, r.Schedule![0].Payment, 0.01m);
            ApproxAssert.Equal(pniExpected.Payment, r.Schedule![24].Payment, 0.02m);
            var expectedSum = ioExpected.TotalInterest + pniExpected.TotalInterest;
            var expectedRounded = Math.Round(expectedSum, 2);
            Assert.Equal(expectedRounded, r.TotalInterest);
        }

        [Fact]
        public void SingleSegment_Equals_PniEngine_Result()
        {
            var amortizer = CreateAmortizer();
            var input = new PiecewiseInput(
                InitialLoanAmount: 600000m,
                Segments: new[]
                {
            new PiecewiseSegmentInput(
                RepaymentType: RepaymentType.PrincipalAndInterest,
                AnnualInterestRate: 0.065m,
                TermPeriods: 360,
                Frequency: RepaymentFrequency.Monthly,
                GenerateSchedule: true,
                Label: null
            )
                },
                GenerateSchedule: true
            );
            var r = amortizer.Calculate(input);
            var pni = new SettlyFinance.Calculators.Engines.PniEngine(new FakeFrequencyProvider(12));
            var pniResult = pni.Calculate(
                new SettlyFinanceTests.Helpers.PniInputBuilder()
                    .Loan(600000m).Rate(0.065m).Periods(360).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );
            ApproxAssert.Equal(pniResult.Payment, r.Schedule![0].Payment, 0.01m);
            var expectedRounded = Math.Round(pniResult.TotalInterest, 2);
            Assert.Equal(expectedRounded, r.TotalInterest);
            Assert.Equal(pniResult.TermPeriods, r.TotalPeriods);
        }
        [Fact]
        public void Throws_On_InvalidInputs()
        {
            var amortizer = CreateAmortizer();

            Assert.Throws<System.ArgumentOutOfRangeException>(() =>
                amortizer.Calculate(new PiecewiseInput(
                    InitialLoanAmount: 0m,
                    Segments: new[]
                    {
                        new PiecewiseSegmentInput(
                            RepaymentType: RepaymentType.InterestOnly,
                            AnnualInterestRate: 0.05m,
                            TermPeriods: 12,
                            Frequency: RepaymentFrequency.Monthly,
                            GenerateSchedule: false,
                            Label: null)
                    },
                    GenerateSchedule: false
                ))
            );
            Assert.Throws<System.ArgumentException>(() =>
                amortizer.Calculate(new PiecewiseInput(
                    InitialLoanAmount: 1_000m,
                    Segments: new PiecewiseSegmentInput[] { }, 
                    GenerateSchedule: false
                ))
            );
        }
        [Fact]
        public void When_NoSchedule_TotalPeriods_StillAggregates()
        {
            var amortizer = CreateAmortizer();

            var r = amortizer.Calculate(new PiecewiseInput(
                InitialLoanAmount: 500000m,
                Segments: new[]
                {
                    new PiecewiseSegmentInput(
                        RepaymentType: RepaymentType.InterestOnly,
                        AnnualInterestRate: 0.05m,
                        TermPeriods: 12,
                        Frequency: RepaymentFrequency.Monthly,
                        GenerateSchedule: false,
                        Label: null
                    ),
                    new PiecewiseSegmentInput(
                        RepaymentType: RepaymentType.PrincipalAndInterest,
                        AnnualInterestRate: 0.06m,
                        TermPeriods: 120,
                        Frequency: RepaymentFrequency.Monthly,
                        GenerateSchedule: false,
                        Label: null
                    ),
                },
                GenerateSchedule: false
            ));
            Assert.Null(r.Schedule);
            Assert.Equal(132, r.TotalPeriods);
        }
    }
}
