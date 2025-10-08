using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyModels.DTOs;
using SettlyModels.DTOs.Loan;

namespace ISettlyService
{
    /// <summary>
    /// Processes a unified request for one or more financial calculations,
    /// such as loan amortization or  Piecewise or stamp duty.
    /// </summary>
    public interface ILoanCalculatorService
    {
        LoanWrapperDtoResponse Calculate(LoanWrapperDtoRequest dto);
    }
}
