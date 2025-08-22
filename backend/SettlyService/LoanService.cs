using System.Collections.Generic;
using System.Runtime.CompilerServices;
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

        public Task<LoanSimulateOutputDto> GenerateLoanSimulateDtoAsync(LoanSimulateInputDto input)
        {
            throw new NotImplementedException();
        }
    }

}
