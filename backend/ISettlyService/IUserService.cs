using SettlyModels.Entities;

namespace ISettlyService;

public interface IUserService
{
    Task<User> AddUserAsync(User user);
}
