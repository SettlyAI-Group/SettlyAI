using SettlyModels.Dtos;
using SettlyModels;
using SettlyModels.Entities;
using ISettlyService;
using Microsoft.EntityFrameworkCore;

namespace SettlyService
{
    public class FavouriteService : IFavouriteService
    {
        private readonly SettlyDbContext _context;

        public FavouriteService(SettlyDbContext context)
        {
            _context = context;
        }
        public async Task<List<Favourite>> GetFavourites(int userId)
        {
            return await _context.Favourites
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }
        public async Task<bool> ToggleFavouriteAsync(AddFavouriteDto dto, int userId)
        {
            var existing = await _context.Favourites.FirstOrDefaultAsync(f => f.UserId == userId && f.TargetType == dto.TargetType && f.TargetId == dto.TargetId);
            if (existing != null)
            {
                _context.Favourites.Remove(existing);
                await _context.SaveChangesAsync();
                return false;
            }//cancel saved
            var newFavourite = new Favourite
            {
                UserId = userId,
                TargetType = dto.TargetType,
                TargetId = dto.TargetId,
                Notes = dto.Notes,
                Priority = dto.Priority,
                CreatedAt = DateTime.UtcNow,
            };
            _context.Favourites.Add(newFavourite);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<Favourite?> GetSingleFavouriteAsync(string targetType, int targetId, int userId)
        {
            return await _context.Favourites.FirstOrDefaultAsync(f => f.UserId ==userId && f.TargetType == targetType && f.TargetId == targetId);
        }
    }
}
