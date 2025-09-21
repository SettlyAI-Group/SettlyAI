using SettlyFinance.Models;
namespace SettlyFinance.Interfaces
{
    /// <summary>
    /// Base contract for an amortization engine.
    /// </summary>
    public interface IAmortizationEngine
    {
        /// <summary>
        /// Calculates repayment metrics for a continuous block.
        /// </summary>
        /// <param name="input">The consolidated input parameters for the calculation.</param>
        AmortizationResult Calculate(AmortizationInput input);
    }
}
