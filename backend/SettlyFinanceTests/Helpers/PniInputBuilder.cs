using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Enums;
using SettlyFinance.Models;

namespace SettlyFinanceTests.Helpers
{
    internal sealed class PniInputBuilder
    {
        private decimal _loan = 500_000m;
        private decimal _rate = 0.05m;
        private int _periods = 360;
        private RepaymentFrequency _freq = RepaymentFrequency.Monthly;
        private bool _withSchedule = true;

        public PniInputBuilder Loan(decimal v) { _loan = v; return this; }
        public PniInputBuilder Rate(decimal v) { _rate = v; return this; }
        public PniInputBuilder Periods(int v) { _periods = v; return this; }
        public PniInputBuilder Freq(RepaymentFrequency v) { _freq = v; return this; }
        public PniInputBuilder WithSchedule(bool v) { _withSchedule = v; return this; }

        public AmortizationInput Build() => new AmortizationInput(
            LoanAmount: _loan,
            AnnualInterestRate: _rate,
            TermPeriods: _periods,
            Frequency: _freq,
            GenerateSchedule: _withSchedule,
            Type: RepaymentType.PrincipalAndInterest // 关键：固定为 PNI
        );
    }
}
