using SettlyModels.Dtos;

namespace ISettlyService;

public interface IAuthService
{
    Task<ResponseUserDto> RegisterAsync(RegisterUserDto registerUser);
    Task<LoginOutputDto> LoginAsync(LoginInputDto loginInput);
}
