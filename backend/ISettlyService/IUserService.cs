using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace ISettlyService;

public interface IUserService
{
    Task<User> AddUserAsync(User user);
    Task<bool> UpdateUserByIdAsync(int userId, UserUpdateDto dto);
}
