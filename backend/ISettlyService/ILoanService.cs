using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ILoanService
    {
        Task<LoanSimulateOutputDto> GenerateLoanSimulateDtoAsync(LoanSimulateInputDto input);
        
    }
}

