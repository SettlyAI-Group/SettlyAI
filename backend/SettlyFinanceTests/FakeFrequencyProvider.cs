using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;

namespace SettlyFinanceTests
{
    public sealed class FakeFrequencyProvider: IFrequencyProvider
    {
        private readonly int _ppy;
        public FakeFrequencyProvider(int periodsPerYear) => _ppy = periodsPerYear;
        public int GetPeriodsPerYear(RepaymentFrequency _) => _ppy;
    }
}
