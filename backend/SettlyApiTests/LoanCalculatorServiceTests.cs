using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyModels.DTOs.Loan;
using SettlyModels.DTOs;
using SettlyService;

namespace SettlyFinanceTests
{
    internal sealed class FakeFacade : ILoanCalculatorFacade
    {
        public PiecewiseInput? CapturedInput { get; private set; }
        public PiecewiseResult ResultToReturn { get; set; } = new PiecewiseResult(
            InitialLoanAmount: 0, TotalPrincipal: 0, TotalInterest: 0, TotalCost: 0, TotalPeriods: 0, Schedule: null, FirstSegmentPayment: 0m);
        public PiecewiseResult CalculateLoan(PiecewiseInput input)
        {
            CapturedInput = input;
            return ResultToReturn;
        }
    }
    public class LoanCalculatorServiceTests
    {
        /// <summary>
        /// Verifies that the Calculate method correctly throws an ArgumentException
        /// when the input request contains neither an amortization nor a piecewise payload,
        /// ensuring invalid or empty requests are rejected.
        /// </summary>
        [Fact]
        public void Calculate_Throws_When_BothNull()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);

            Assert.Throws<ArgumentException>(() =>
                svc.Calculate(new LoanWrapperDtoRequest(null, null)));
        }
        /// <summary>
        /// Tests the service's behavior when a request erroneously contains both
        /// an amortization and a piecewise payload. It confirms that the service
        /// correctly prioritizes and processes the piecewise calculation, as per the
        /// business logic, ignoring the amortization data.
        /// </summary>
        [Fact]
        public void Calculate_When_BothProvided_Prefers_Piecewise()
        {
            var facade = new FakeFacade();
            var svc = new LoanCalculatorService(facade);
            facade.ResultToReturn = new PiecewiseResult(
                InitialLoanAmount: 123m,
                TotalPrincipal: 1, TotalInterest: 2, TotalCost: 3, TotalPeriods: 4,
                Schedule: null,
                FirstSegmentPayment: 100m
            );
            var req = new LoanWrapperDtoRequest(
                new AmortizationRequestDto(1000, 0.05m, 12, RepaymentFrequency.Monthly, RepaymentType.PrincipalAndInterest, true),
                new PiecewiseRequestDto(2000, new List<PiecewiseSegmentDto>{
            new PiecewiseSegmentDto(RepaymentType.InterestOnly, 0.05m, 12, RepaymentFrequency.Monthly, true, "IO")
                }, true)
            );

            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.NotNull(resp.Piecewise);
            Assert.Null(resp.Amortization);
        }
        /// <summary>
        /// Verifies a key scenario for amortization requests where the client does not
        /// require a full schedule (GenerateSchedule is false). This test ensures that the
        /// service can still calculate and return the correct repayment amount and other summary
        /// totals by using the dedicated 'FirstSegmentPayment' field from the facade's result,
        /// even when the schedule list is null.
        /// </summary>
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
            TermPeriods: 360,
            Frequency: RepaymentFrequency.Monthly,
            RepaymentType: RepaymentType.PrincipalAndInterest,
            GenerateSchedule: false 
        ),
        null
    );
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.False(facade.CapturedInput!.GenerateSchedule);
            Assert.NotNull(resp.Amortization);
            Assert.Null(resp.Amortization!.Schedule); 
            Assert.Equal(expectedPayment, resp.Amortization.Payment);
            Assert.Equal(expectedTotalCost, resp.Amortization.TotalCost);
            Assert.Equal((int)Math.Ceiling(expectedPayment), resp.Amortization.DisplayPayment);
        }
        /// <summary>
        /// Tests the standard path for a single amortization request (where a schedule is generated).
        /// It confirms that the service correctly translates the simple AmortizationRequestDto into
        /// a single-segment PiecewiseInput for the core calculation engine. It also verifies
        /// that the response from the facade is correctly mapped ("flattened") back into the
        /// expected AmortizationResponseDto format.
        /// </summary>
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
                    TermPeriods: 360,
                    Frequency: RepaymentFrequency.Monthly,
                    RepaymentType: RepaymentType.PrincipalAndInterest,
                    GenerateSchedule: true
                ),
                null
            );
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.Equal(600000m, facade.CapturedInput!.InitialLoanAmount);
            Assert.Single(facade.CapturedInput.Segments);
            Assert.Equal(RepaymentType.PrincipalAndInterest, facade.CapturedInput.Segments[0].RepaymentType);
            Assert.Equal(360, facade.CapturedInput.Segments[0].TermPeriods);
            Assert.NotNull(resp.Amortization);
            Assert.Null(resp.Piecewise);
            Assert.Equal(expectedPayment, resp.Amortization!.Payment);
            Assert.Equal(1365266.93m, resp.Amortization.TotalCost);
            Assert.Equal(360, resp.Amortization.TermPeriods);
            Assert.NotNull(resp.Amortization.Schedule);
            Assert.True(resp.Amortization.DisplayPayment >= (int)Math.Ceiling(resp.Amortization.Payment));
        }
        /// <summary>
        /// Tests the direct path for a multi-segment piecewise loan calculation.
        /// This test ensures that the DTOs for each segment are correctly mapped to the
        /// domain models for the facade. It also verifies that the aggregated results
        /// (like total cost and the full schedule) are passed through from the facade
        /// to the final response DTO without modification.
        /// </summary>
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
                    new PiecewiseScheduleRow(1, 0, 1, 2400m, 2400m, 0m, 500000m, "IO"),
                    new PiecewiseScheduleRow(25, 1, 1, 3200m, 2700m, 500m, 499500m, "PNI")
                },
                FirstSegmentPayment: 2400
            );
            var req = new LoanWrapperDtoRequest(
                null,
                new PiecewiseRequestDto(
                    InitialLoanAmount: 500000m,
                    Segments: new List<PiecewiseSegmentDto>
                    {
                        new PiecewiseSegmentDto(
                            RepaymentType: RepaymentType.InterestOnly,
                            AnnualInterestRate: 0.0575m,
                            TermPeriods: 24,
                            Frequency: RepaymentFrequency.Monthly,
                            GenerateSchedule: true,
                            Label: "IO"
                        ),
                        new PiecewiseSegmentDto(
                            RepaymentType: RepaymentType.PrincipalAndInterest,
                            AnnualInterestRate: 0.065m,
                            TermPeriods: 336,
                            Frequency: RepaymentFrequency.Monthly,
                            GenerateSchedule: true,
                            Label: "PNI"
                        )
                    },
                    GenerateSchedule: true
                )
            );
            var resp = svc.Calculate(req);
            Assert.NotNull(facade.CapturedInput);
            Assert.Equal(2, facade.CapturedInput!.Segments.Count);
            Assert.Equal(RepaymentType.InterestOnly, facade.CapturedInput.Segments[0].RepaymentType);
            Assert.Equal("IO", facade.CapturedInput.Segments[0].Label);
            Assert.Equal(RepaymentType.PrincipalAndInterest, facade.CapturedInput.Segments[1].RepaymentType);
            Assert.Equal("PNI", facade.CapturedInput.Segments[1].Label);
            Assert.NotNull(resp.Piecewise);
            Assert.Equal(500000m, resp.Piecewise!.InitialLoanAmount);
            Assert.Equal(360, resp.Piecewise.TotalPeriods);
            Assert.NotNull(resp.Piecewise.Schedule);
            Assert.Equal("IO", resp.Piecewise.Schedule![0].SegmentLabel);
            Assert.Equal("PNI", resp.Piecewise.Schedule![1].SegmentLabel);
        }
    }
}
