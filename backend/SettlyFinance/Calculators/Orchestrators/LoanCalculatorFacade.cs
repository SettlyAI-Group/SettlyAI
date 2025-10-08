using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;

namespace SettlyFinance.Calculators.Orchestrators
{
    public sealed class LoanCalculatorFacade: ILoanCalculatorFacade 
    {
        private readonly IAmortizationEngineFactory _factory;
        private readonly IPiecewiseAmortizer _piecewise;
        public LoanCalculatorFacade(
            IAmortizationEngineFactory factory,
            IPiecewiseAmortizer piecewise)
        {
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
            _piecewise = piecewise ?? throw new ArgumentNullException(nameof(piecewise));
        }
        public AmortizationResult CalculateSingle(AmortizationInput input)
           => _factory.GetEngine(input.RepaymentType).Calculate(input);
        public PiecewiseResult CalculateLoan(PiecewiseInput input)
            => _piecewise.Calculate(input);
    }
}
