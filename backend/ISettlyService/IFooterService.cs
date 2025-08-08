using SettlyModels.DTOs;
using SettlyModels.Common;

namespace SettlyService.Interfaces
{
  public interface IFooterService
  {
    Task<Result<FooterResponseDto>> GetActiveFooterAsync();
    Task<Result<FooterResponseDto>> GetFooterByIdAsync(int id);
    Task<Result<FooterResponseDto>> CreateFooterAsync(CreateFooterRequestDto request, string userId);
    Task<Result<FooterResponseDto>> UpdateFooterAsync(UpdateFooterRequestDto request, string userId);
    Task<Result<bool>> DeleteFooterAsync(int id, string userId);
    Task<Result<bool>> ActivateFooterAsync(int id, string userId);
    Task<Result<IEnumerable<FooterResponseDto>>> GetFooterHistoryAsync();
  }
}