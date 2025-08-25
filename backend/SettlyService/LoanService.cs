using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SettlyModels;
using SettlyModels.Dtos;


namespace SettlyService
{

    public class LoanService : ILoanService
    {
        private readonly StampDutyCalculator _calculator;
        public LoanService()
        {
            _calculator = new StampDutyCalculator("../SettlyApi/Data/vic_stamp_duty.json");
        }
        public Task<LoanSimulateOutputDto> GenerateLoanSimulateDtoAsync(LoanSimulateInputDto input)
        {

            var duty = _calculator.Calculate(input);

            var output = new LoanSimulateOutputDto
            {
                StampDuty = duty
            };
            return Task.FromResult(output);
        }
    }
}
