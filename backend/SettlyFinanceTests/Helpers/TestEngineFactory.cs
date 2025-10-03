using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Calculators.Engines;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;

namespace SettlyFinanceTests.Helpers
{
    internal sealed class TestEngineFactory: IAmortizationEngineFactory
    {
        private readonly IFrequencyProvider _fp;
        public TestEngineFactory(IFrequencyProvider fp) => _fp = fp ?? throw new ArgumentNullException(nameof(fp));
        public IAmortizationEngine GetEngine(RepaymentType type)
            => type == RepaymentType.PrincipalAndInterest
                ? new PniEngine(_fp)
                : new IoEngine(_fp);
    }
}
