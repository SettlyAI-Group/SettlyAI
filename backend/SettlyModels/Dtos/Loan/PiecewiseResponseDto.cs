using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.DTOs.Loan
{
    public sealed record PiecewiseResponseDto(
    decimal InitialLoanAmount,
    decimal TotalPrincipal,
    decimal TotalInterest,
    decimal TotalCost,
    int TotalPeriods,
    IReadOnlyList<PiecewiseScheduleRowDto>? Schedule
);
}
