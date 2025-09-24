using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ISettlyService;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyModels.DTOs.Loan;

namespace SettlyService
{
    public sealed class LoanCalculatorService: ILoanCalculatorService
    {
        private readonly IAmortizationEngineFactory _factory;
        public LoanCalculatorService(IAmortizationEngineFactory factory) => _factory = factory;
        public AmortizationResponseDto Calculate(AmortizationRequestDto dto)
        {
            var input = new AmortizationInput(
                LoanAmount: dto.LoanAmount,
                AnnualInterestRate: dto.AnnualInterestRate,
                TermPeriods: dto.TermPeriods,
                Frequency: dto.Frequency,
                GenerateSchedule: dto.GenerateSchedule,
                Type: dto.Type
            );
            var result = _factory.GetEngine(dto.Type).Calculate(input);
            return new AmortizationResponseDto(result);
        }
    }
}
