using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Models;

namespace SettlyFinance.Interfaces
{
    public interface ILoanCalculatorFacade
    {
        PiecewiseResult CalculateLoan(PiecewiseInput input);
    }
}
