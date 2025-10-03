using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Calculators.Engines;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;

namespace SettlyFinance.Calculators
{
    /// <summary>Chooses the proper engine based on <see cref="RepaymentType"/>.</summary>
    public sealed class AmortizationEngineFactory : IAmortizationEngineFactory
    {
        private readonly IFrequencyProvider _frequencyProvider;
        private readonly Lazy<IAmortizationEngine> _pni;
        private readonly Lazy<IAmortizationEngine> _io;
        public AmortizationEngineFactory(IFrequencyProvider frequencyProvider)
        {
            if (frequencyProvider == null)
            {
                throw new ArgumentNullException(nameof(frequencyProvider));
            }
            _frequencyProvider = frequencyProvider;
            _pni = new Lazy<IAmortizationEngine>(() => new PniEngine(_frequencyProvider));
            _io = new Lazy<IAmortizationEngine>(() => new IoEngine(_frequencyProvider));
        }
        public IAmortizationEngine GetEngine(RepaymentType type) => type switch
        {
            RepaymentType.PrincipalAndInterest => _pni.Value,
            RepaymentType.InterestOnly => _io.Value,
            _ => throw new NotSupportedException($"Unsupported repayment type: {type}")
        };
    }
}
