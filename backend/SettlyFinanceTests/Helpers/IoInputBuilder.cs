using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Models;
namespace SettlyFinanceTests.Helpers
{
    internal sealed class IoInputBuilder
    {
        private decimal _loan = 500_000m;
        private decimal _rate = 0.05m;
        private int _periods = 36;
        private RepaymentFrequency _freq = RepaymentFrequency.Monthly;
        private bool _withSchedule = true;
        public IoInputBuilder Loan(decimal v) { _loan = v; return this; }
        public IoInputBuilder Rate(decimal v) { _rate = v; return this; }
        public IoInputBuilder Periods(int v) { _periods = v; return this; }
        public IoInputBuilder Freq(RepaymentFrequency v) { _freq = v; return this; }
        public IoInputBuilder WithSchedule(bool v) { _withSchedule = v; return this; }
        public  AmortizationInput Build()
        {
            return new AmortizationInput(
                LoanAmount: _loan,
                AnnualInterestRate: _rate,
                TermPeriods: _periods,
                Frequency: _freq,
                GenerateSchedule: _withSchedule,
                RepaymentType: RepaymentType.InterestOnly);
        }
    }
}
