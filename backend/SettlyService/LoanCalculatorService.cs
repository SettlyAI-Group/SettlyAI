using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ISettlyService;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyModels.DTOs;
using SettlyModels.DTOs.Loan;

namespace SettlyService
{
    /// <summary>
    /// Implements the main application service for financial calculations.
    /// It acts as a mediator, receiving DTOs from the API layer and delegating work
    /// to the core business logic layer (Facade).
    /// </summary>
    public sealed class LoanCalculatorService : ILoanCalculatorService
    {
        private readonly ILoanCalculatorFacade _facade;
        public LoanCalculatorService(ILoanCalculatorFacade facade)
        {
            _facade = facade ?? throw new ArgumentNullException(nameof(facade));
        }
        public LoanWrapperDtoResponse Calculate(LoanWrapperDtoRequest dto)
        {
            if (dto is null) throw new ArgumentNullException(nameof(dto));
            var hasAm = dto.Amortization is not null;
            var hasPw = dto.Piecewise is not null;
            if (!hasAm && !hasPw)
                throw new ArgumentException("Request must contain exactly one of 'Amortization' or 'Piecewise'.");
            if (hasAm == hasPw)
                throw new ArgumentException("Request must contain exactly one of 'Amortization' or 'Piecewise'.", nameof(dto));
            AmortizationResponseDto? amortizationResponse = null;
            PiecewiseResponseDto? piecewiseResponse = null;
            if (hasPw)
            {
                var pwReq = dto.Piecewise!;
                if (pwReq.Segments is null || pwReq.Segments.Count == 0)
                    throw new ArgumentException("Piecewise.Segments must contain at least one segment.");
                var domainInput = new PiecewiseInput(
                    InitialLoanAmount: pwReq.InitialLoanAmount,
                    Segments: pwReq.Segments.Select(s => new PiecewiseSegmentInput(
                        RepaymentType: s.RepaymentType,
                        AnnualInterestRate: s.AnnualInterestRate,
                        TermPeriods: s.TermPeriods,
                        Frequency: s.Frequency,
                        GenerateSchedule: s.GenerateSchedule,
                        Label: s.Label
                    )).ToList(),
                    GenerateSchedule: pwReq.GenerateSchedule
                );
                var result = _facade.CalculateLoan(domainInput);
                piecewiseResponse = new PiecewiseResponseDto(
                    InitialLoanAmount: result.InitialLoanAmount,
                    TotalPrincipal: result.TotalPrincipal,
                    TotalInterest: result.TotalInterest,
                    TotalCost: result.TotalCost,
                    TotalPeriods: result.TotalPeriods,
                    FirstSegmentPayment: result.FirstSegmentPayment,
                    Schedule: result.Schedule?.Select(r => new PiecewiseScheduleRowDto(
                        GlobalPeriod: r.GlobalPeriod,
                        SegmentIndex: r.SegmentIndex,
                        SegmentPeriod: r.SegmentPeriod,
                        Payment: r.Payment,
                        Interest: r.Interest,
                        Principal: r.Principal,
                        EndingBalance: r.EndingBalance,
                        SegmentLabel: r.SegmentLabel
                    )).ToList()
                );
            }
            else
            {
                var amReq = dto.Amortization!;
                var singleSegment = new PiecewiseSegmentInput(
                    RepaymentType: amReq.RepaymentType,
                    AnnualInterestRate: amReq.AnnualInterestRate,
                    TermPeriods: amReq.TermPeriods,
                    Frequency: amReq.Frequency,
                    GenerateSchedule: amReq.GenerateSchedule,
                    Label: null
                );
                var pwForSingle = new PiecewiseInput(
                    InitialLoanAmount: amReq.LoanAmount,
                    Segments: new List<PiecewiseSegmentInput> { singleSegment },
                    GenerateSchedule: amReq.GenerateSchedule
                );
                var pwResult = _facade.CalculateLoan(pwForSingle);
                var firstPayment = pwResult.FirstSegmentPayment;
                var displayPayment = (int)Math.Ceiling(firstPayment);
                var scheduleRows = pwResult.Schedule?.Select(row => new AmortizationScheduleRowDto(
                    Period: row.GlobalPeriod,
                    Payment: row.Payment,
                    Interest: row.Interest,
                    Principal: row.Principal,
                    EndingBalance: row.EndingBalance
                )).ToList();
                amortizationResponse = new AmortizationResponseDto(
                    LoanAmount: amReq.LoanAmount,
                    AnnualInterestRate: amReq.AnnualInterestRate,
                    Frequency: amReq.Frequency,
                    RepaymentType: amReq.RepaymentType,
                    Payment: firstPayment,
                    DisplayPayment: displayPayment,
                    TotalInterest: pwResult.TotalInterest,
                    TotalPrincipal: pwResult.TotalPrincipal,
                    TotalCost: pwResult.TotalCost,
                    TermPeriods: pwResult.TotalPeriods,
                    Schedule: scheduleRows
                );
            }
            return new LoanWrapperDtoResponse(amortizationResponse, piecewiseResponse);
        }
    }
}
