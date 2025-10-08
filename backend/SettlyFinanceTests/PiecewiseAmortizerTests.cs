using System;
using System.Collections.Generic;
using System.Linq;
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

            // 逐期：360 行
            Assert.Equal(360, r.TotalPeriods);
            Assert.NotNull(r.Schedule);
            Assert.Equal(360, r.Schedule!.Count);

            var fp = new FakeFrequencyProvider(12);

            // 期望：IO 段（24期，逐期） + PNI 段（按剩余336期算期供）
            var ioExpected = new SettlyFinance.Calculators.Engines.IoEngine(fp).Calculate(
                new IoInputBuilder()
                    .Loan(600000m).Rate(0.059m).Periods(24).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );
            var pniExpected = new SettlyFinance.Calculators.Engines.PniEngine(fp).Calculate(
                new PniInputBuilder()
                    .Loan(600000m).Rate(0.065m).Periods(336).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );

            // 首段是 IO：FirstSegmentPayment = IO 每期利息
            ApproxAssert.Equal(ioExpected.Payment, r.FirstSegmentPayment, 0.01m);

            // 第1期为 IO
            var m1 = r.Schedule![0];
            ApproxAssert.Equal(ioExpected.Payment, m1.Payment, 0.01m);
            ApproxAssert.Equal(ioExpected.Schedule![0].Interest, m1.Interest, 0.01m);
            ApproxAssert.Equal(0m, m1.Principal, 0.01m);

            // 第24期（IO 段末）
            var m24 = r.Schedule![23];
            ApproxAssert.Equal(ioExpected.Schedule![23].Payment, m24.Payment, 0.01m);
            ApproxAssert.Equal(ioExpected.Schedule![23].Interest, m24.Interest, 0.01m);
            ApproxAssert.Equal(ioExpected.Schedule![23].EndingBalance, m24.EndingBalance, 0.01m);

            // 第25期进入 PNI：期供应与“剩余336期”的 PNI 引擎一致
            var m25 = r.Schedule![24];
            ApproxAssert.Equal(pniExpected.Payment, m25.Payment, 0.02m);

            // 总利息 = IO 段利息 + PNI 段利息（到分）
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

            // 逐期：360 行
            Assert.Equal(360, r.TotalPeriods);
            Assert.NotNull(r.Schedule);
            Assert.Equal(360, r.Schedule!.Count);

            var pni = new SettlyFinance.Calculators.Engines.PniEngine(new FakeFrequencyProvider(12));
            var pniResult = pni.Calculate(
                new PniInputBuilder()
                    .Loan(600000m).Rate(0.065m).Periods(360).Freq(RepaymentFrequency.Monthly).WithSchedule(true)
                    .Build()
            );

            // 首段就是 PNI：FirstSegmentPayment 等于 PNI 期供
            ApproxAssert.Equal(pniResult.Payment, r.FirstSegmentPayment, 0.01m);

            // 第1期逐期对得上
            var m1 = r.Schedule![0];
            ApproxAssert.Equal(pniResult.Schedule![0].Payment, m1.Payment, 0.02m);
            ApproxAssert.Equal(pniResult.Schedule![0].Interest, m1.Interest, 0.02m);
            ApproxAssert.Equal(pniResult.Schedule![0].Principal, m1.Principal, 0.02m);
            ApproxAssert.Equal(pniResult.Schedule![0].EndingBalance, m1.EndingBalance, 0.02m);

            // 总利息一致（到分）
            var expectedRounded = Math.Round(pniResult.TotalInterest, 2);
            Assert.Equal(expectedRounded, r.TotalInterest);
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
