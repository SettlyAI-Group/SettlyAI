using System;
using System.Collections.Generic;
using System.Linq;
using ISettlyService;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyModels.DTOs;
using SettlyModels.DTOs.Loan;
using SettlyService;
using Xunit;
namespace SettlyFinanceTests
{
    internal sealed class FakeFacade : ILoanCalculatorFacade
    {
        public PiecewiseInput? CapturedInput { get; private set; }

        public PiecewiseResult ResultToReturn { get; set; } =
            new PiecewiseResult(
                InitialLoanAmount: 0,
                TotalPrincipal: 0,
                TotalInterest: 0,
                TotalCost: 0,
                TotalPeriods: 0,
                Schedule: null,
                FirstSegmentPayment: 0m);
        public PiecewiseResult CalculateLoan(PiecewiseInput input)
        {
            CapturedInput = input;
            return ResultToReturn;
        }
    }
    public class LoanCalculatorServiceTests
    {
        [Fact]
        public void Calculate_Throws_When_BothNull()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);

            Assert.Throws<ArgumentException>(() =>
                svc.Calculate(new LoanWrapperDtoRequest(null, null)));
        }
        [Fact]
        public void Calculate_Throws_When_Both_Provided()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);

            var req = new LoanWrapperDtoRequest(
                Amortization: new AmortizationRequestDto(
                    LoanAmount: 1000m,
                    AnnualInterestRate: 0.05m,
                    LoanTermYears: 1,
                    Frequency: RepaymentFrequency.Monthly,
                    RepaymentType: RepaymentType.PrincipalAndInterest,
                    GenerateSchedule: false),
                Piecewise: new PiecewiseRequestDto(
                    InitialLoanAmount: 1000m,
                    Frequency: RepaymentFrequency.Monthly,
                    Segments: new List<PiecewiseSegmentDto>
                    {
                        new PiecewiseSegmentDto(
                            RepaymentType: RepaymentType.PrincipalAndInterest,
                            AnnualInterestRate: 0.05m,
                            LoanTermYears: 1)
                    },
                    GenerateSchedule: false));

            Assert.Throws<ArgumentException>(() => svc.Calculate(req));
        }
        [Fact]
        public void AmortizationBranch_MapsTo_SingleSegment_ExtractsPayment_When_ScheduleIsFalse()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);

            const decimal expectedPayment = 3792.41m;
            const decimal expectedTotalCost = 1365266.93m;

            facade.ResultToReturn = new PiecewiseResult(
                InitialLoanAmount: 600000m,
                TotalPrincipal: 600000m,
                TotalInterest: 765266.93m,
                TotalCost: expectedTotalCost,
                TotalPeriods: 360,
                Schedule: null, 
                FirstSegmentPayment: expectedPayment 
            );
            var req = new LoanWrapperDtoRequest(
                new AmortizationRequestDto(
                    LoanAmount: 600000m,
                    AnnualInterestRate: 0.065m,
                    LoanTermYears: 30, 
                    Frequency: RepaymentFrequency.Monthly,
                    RepaymentType: RepaymentType.PrincipalAndInterest,
                    GenerateSchedule: false),
                null);
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.False(facade.CapturedInput!.GenerateSchedule);
            Assert.NotNull(resp.Amortization);
            Assert.Null(resp.Amortization!.Schedule);
            Assert.Equal(expectedPayment, resp.Amortization.Payment);
            Assert.Equal(expectedTotalCost, resp.Amortization.TotalCost);
            Assert.Equal((int)Math.Ceiling(expectedPayment), resp.Amortization.DisplayPayment);
        }
        [Fact]
        public void AmortizationBranch_MapsTo_SingleSegmentPiecewise_And_FlattensResponse()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);

            const decimal expectedPayment = 3792.41m;

            facade.ResultToReturn = new PiecewiseResult(
                InitialLoanAmount: 600000m,
                TotalPrincipal: 600000m,
                TotalInterest: 765266.93m,
                TotalCost: 1365266.93m,
                TotalPeriods: 360,
                Schedule: new[]
                {
                    new PiecewiseScheduleRow(
                        GlobalPeriod: 1, SegmentIndex: 0, SegmentPeriod: 1,
                        Payment: 3792.41m, Interest: 3250.00m, Principal: 542.41m,
                        EndingBalance: 599457.59m, SegmentLabel: null)
                },
                FirstSegmentPayment: expectedPayment
            );
            var req = new LoanWrapperDtoRequest(
                new AmortizationRequestDto(
                    LoanAmount: 600000m,
                    AnnualInterestRate: 0.065m,
                    LoanTermYears: 30, 
                    Frequency: RepaymentFrequency.Monthly,
                    RepaymentType: RepaymentType.PrincipalAndInterest,
                    GenerateSchedule: true),
                null);
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.Equal(600000m, facade.CapturedInput!.InitialLoanAmount);
            Assert.Single(facade.CapturedInput.Segments);
            Assert.Equal(360, facade.CapturedInput.Segments[0].TermPeriods);
            Assert.NotNull(resp.Amortization);
            Assert.Null(resp.Piecewise);
            Assert.Equal(expectedPayment, resp.Amortization!.Payment);
            Assert.Equal(1365266.93m, resp.Amortization.TotalCost);
            Assert.Equal(360, resp.Amortization.TermPeriods);
            Assert.NotNull(resp.Amortization.Schedule);
            Assert.True(resp.Amortization.DisplayPayment >= (int)Math.Ceiling(resp.Amortization.Payment));
        }
        [Fact]
        public void PiecewiseBranch_MapsSegments_And_PassesThroughAggregate()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);
            facade.ResultToReturn = new PiecewiseResult(
                InitialLoanAmount: 500000m,
                TotalPrincipal: 500000m,
                TotalInterest: 300000m,
                TotalCost: 800000m,
                TotalPeriods: 360,
                Schedule: new[]
                {
                    new PiecewiseScheduleRow(1,  0, 1, 2400m, 2400m, 0m,     500000m, "IO 2y"),
                    new PiecewiseScheduleRow(25, 1, 1, 3200m, 2700m, 500m,   499500m, "P&I 28y")
                },
                FirstSegmentPayment: 2400m
            );
            var req = new LoanWrapperDtoRequest(
                null,
                new PiecewiseRequestDto(
                    InitialLoanAmount: 500000m,
                    Frequency: RepaymentFrequency.Monthly, 
                    Segments: new List<PiecewiseSegmentDto>
                    {
                        new PiecewiseSegmentDto(
                            RepaymentType: RepaymentType.InterestOnly,
                            AnnualInterestRate: 0.0575m,
                            LoanTermYears: 2),
                        new PiecewiseSegmentDto(
                            RepaymentType: RepaymentType.PrincipalAndInterest,
                            AnnualInterestRate: 0.065m,
                            LoanTermYears: 28)
                    },
                    GenerateSchedule: true
                ));
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.Equal(2, facade.CapturedInput!.Segments.Count);
            Assert.Equal(24, facade.CapturedInput.Segments[0].TermPeriods);
            Assert.Equal(336, facade.CapturedInput.Segments[1].TermPeriods);
            Assert.Equal(RepaymentType.InterestOnly, facade.CapturedInput.Segments[0].RepaymentType);
            Assert.Equal(RepaymentType.PrincipalAndInterest, facade.CapturedInput.Segments[1].RepaymentType);
            Assert.False(string.IsNullOrWhiteSpace(facade.CapturedInput.Segments[0].Label));
            Assert.False(string.IsNullOrWhiteSpace(facade.CapturedInput.Segments[1].Label));
            Assert.NotNull(resp.Piecewise);
            Assert.Equal(500000m, resp.Piecewise!.InitialLoanAmount);
            Assert.Equal(360, resp.Piecewise.TotalPeriods);
            Assert.NotNull(resp.Piecewise.Schedule);
        }
    }
}
