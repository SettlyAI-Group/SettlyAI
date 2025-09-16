using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Interfaces;

namespace SettlyFinance.Calculators
{
    public class FrequencyProvider : IFrequencyProvider
    {
        public int GetPeriodsPerYear(RepaymentFrequency frequency)
        {
            switch (frequency)
            {
                case RepaymentFrequency.Monthly: return 12;
                case RepaymentFrequency.Fortnightly: return 26;
                case RepaymentFrequency.Weekly: return 52;
                default:
                    throw new ArgumentOutOfRangeException(nameof(frequency), $"Unsupported repayment frequency: {frequency}");
            }
        }
    }
}
