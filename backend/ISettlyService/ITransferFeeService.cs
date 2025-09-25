using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ITransferFeeService
    {
        TransferFeeResponseDto CalculateFee(TransferFeeRequestDto request);
    }
}
