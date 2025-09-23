using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyModels.DTOs.Loan;

namespace ISettlyService
{
    public interface ILoanCalculatorService
    {
        AmortizationResponseDto Calculate(AmortizationRequestDto dto);
    }
}
