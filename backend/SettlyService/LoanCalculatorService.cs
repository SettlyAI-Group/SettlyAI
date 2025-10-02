using System;
using System.Collections.Generic;
using System.Linq;
using ISettlyService;
using SettlyFinance.Enums;
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
            if (hasAm == hasPw)
                throw new ArgumentException("Request must contain exactly one of 'Amortization' or 'Piecewise'.", nameof(dto));
            AmortizationResponseDto? amortizationResponse = null;
            PiecewiseResponseDto? piecewiseResponse = null;
            if (hasPw)
            {
                var pwReq = dto.Piecewise!;
                if (pwReq.Segments is null || pwReq.Segments.Count == 0)
                    throw new ArgumentException("Piecewise.Segments must contain at least one segment.");
                int ppy = GetPeriodsPerYear(pwReq.Frequency);

                var segments = pwReq.Segments.Select((s, idx) =>
                {
                    if (s.LoanTermYears <= 0)
                        throw new ArgumentException($"Segments[{idx}].LoanTermYears must be > 0.");
                    int termPeriods = checked(s.LoanTermYears * ppy);
                    var normalizedRate = NormalizeAnnualRate(s.AnnualInterestRate);
                    return new PiecewiseSegmentInput(
                        RepaymentType: s.RepaymentType,
                        AnnualInterestRate: normalizedRate,
                        TermPeriods: termPeriods,
                        Frequency: pwReq.Frequency, 
                        GenerateSchedule: true,    
                        Label: MakeSegmentLabel(s.RepaymentType, s.LoanTermYears, normalizedRate, pwReq.Frequency)
                    );
                }).ToList();
                var domainInput = new PiecewiseInput(
                    InitialLoanAmount: pwReq.InitialLoanAmount,
                    Segments: segments,
                    GenerateSchedule: pwReq.GenerateSchedule
                );
                var result = _facade.CalculateLoan(domainInput);
                string? ratioPercent = ComputePaymentToIncomeRatioPercent(
                    paymentPerPeriod: result.FirstSegmentPayment,
                    netAnnualIncome: pwReq.NetAnnualIncome,
                    frequency: pwReq.Frequency
                );
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
                    )).ToList(),
                    FirstSegmentPaymentToIncomeRatioPercent: ratioPercent
                );
            }
            else
            {
                var amReq = dto.Amortization!;
                if (amReq.LoanTermYears <= 0)
                    throw new ArgumentException("Amortization.loanTermYears must be > 0.");
                int resolvedTerm = checked(amReq.LoanTermYears * GetPeriodsPerYear(amReq.Frequency));
                var singleSegment = new PiecewiseSegmentInput(
                    RepaymentType: amReq.RepaymentType,
                    AnnualInterestRate: NormalizeAnnualRate(amReq.AnnualInterestRate),
                    TermPeriods: resolvedTerm,
                    Frequency: amReq.Frequency,
                    GenerateSchedule: true, 
                    Label: MakeSegmentLabel(amReq.RepaymentType, amReq.LoanTermYears, NormalizeAnnualRate(amReq.AnnualInterestRate), amReq.Frequency)
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
                string? ratioPercent = ComputePaymentToIncomeRatioPercent(
                    paymentPerPeriod: firstPayment,
                    netAnnualIncome: amReq.NetAnnualIncome,
                    frequency: amReq.Frequency
                );
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
                    Schedule: scheduleRows,
                    PaymentToIncomeRatioPercent: ratioPercent
                );
            }
            return new LoanWrapperDtoResponse(amortizationResponse, piecewiseResponse);
        }
        private static decimal NormalizeAnnualRate(decimal r)
        {
            if (r < 0) throw new ArgumentOutOfRangeException(nameof(r), "Annual interest rate cannot be negative");
            if (r <= 1m) return r;
            if (r <= 100m) return r / 100m;
            throw new ArgumentOutOfRangeException(nameof(r),"Annual interest rate looks too large. Use decimal (e.g., 0.065) or percent (e.g., 6.5).");
        }
        private static string MakeSegmentLabel(RepaymentType type, int years, decimal annualRate, RepaymentFrequency freq)
        {
            var kind = type == RepaymentType.InterestOnly ? "IO" : "P&I";
            return $"{kind} {years}y @ {(annualRate * 100m):0.###}% ({freq})";
        }
        private static int GetPeriodsPerYear(RepaymentFrequency frequency) => frequency switch
        {
            RepaymentFrequency.Monthly => 12,
            RepaymentFrequency.Fortnightly => 26,
            RepaymentFrequency.Weekly => 52,
            _ => throw new NotSupportedException($"Unsupported frequency: {frequency}")
        };
        private static string? ComputePaymentToIncomeRatioPercent(decimal paymentPerPeriod, decimal? netAnnualIncome, RepaymentFrequency frequency)
        {
            if (netAnnualIncome is null || netAnnualIncome <= 0m) return null;
            var ppy = GetPeriodsPerYear(frequency);
            var incomePerPeriod = netAnnualIncome.Value / ppy;
            if (incomePerPeriod <= 0m) return null;
            var ratio = paymentPerPeriod / incomePerPeriod; 
            return $"{(ratio * 100m):0.00}%"; 
        }
    }
}
