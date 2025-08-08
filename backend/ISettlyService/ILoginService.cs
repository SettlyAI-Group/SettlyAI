using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace ISettlyService
{
    public interface ILoginService
    {
        Task<LoginOutputDto> LoginAsync(LoginInputDto loginInput);
    }
}
