using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;

namespace SettlyModels.DTOs.Loan
{
    public sealed record PiecewiseSegmentDto(
        RepaymentType Type,
        decimal AnnualInterestRate,
        int TermPeriods,
        RepaymentFrequency Frequency,
        bool GenerateSchedule = true,
        string? Label = null
    );
}
