using ISettlyService;
using SettlyModels;
using SettlyModels.Entities;

namespace SettlyService;

public class UserService : IUserService
{
    private readonly SettlyDbContext _context;

    public UserService(SettlyDbContext context)
    {
        _context = context;
    }

    public async Task<User> AddUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }


}
