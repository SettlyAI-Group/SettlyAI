using AutoMapper;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace SettlyService;

public class UserService : IUserService
{
    private readonly SettlyDbContext _context;
    private readonly IMapper _mapper;
    public UserService(SettlyDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<User> AddUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> UpdateUserByIdAsync(int userId, UserUpdateDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        // Todo throw not found error
        if (user is null) return false;

        _mapper.Map(dto, user);

        await _context.SaveChangesAsync();
        return true;
    }
}
