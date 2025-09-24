using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyModels.DTOs.Loan;

namespace SettlyModels.DTOs
{
    public sealed class LoanWrapperDtoRequest
    (
        AmortizationRequestDto? Amortization,
        PiecewiseRequestDto? Piecewise
    );
}
