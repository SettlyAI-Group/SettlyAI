using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Models;
using SettlyFinance.Enums;

namespace SettlyModels.DTOs.Loan
{
    /// <summary>
    /// Wrapper for amortization calculation results.
    /// </summary>
    public sealed record AmortizationResponseDto(
    decimal LoanAmount,
    decimal AnnualInterestRate,
    RepaymentFrequency Frequency,
    RepaymentType RepaymentType,
    decimal Payment,
    int DisplayPayment,
    decimal TotalInterest,
    decimal TotalPrincipal,
    decimal TotalCost,
    int TermPeriods,
    IReadOnlyList<AmortizationScheduleRowDto>? Schedule
);
    }
