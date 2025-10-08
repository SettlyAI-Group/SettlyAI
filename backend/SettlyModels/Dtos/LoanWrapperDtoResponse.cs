using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyModels.DTOs.Loan;

namespace SettlyModels.DTOs
{
    /// <summary>
    /// The single, unified request DTO for the main calculation endpoint.
    /// </summary>
    public sealed record LoanWrapperDtoResponse
    (
        AmortizationResponseDto? Amortization,
        PiecewiseResponseDto? Piecewise
    );
}
