using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavouriteController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;

        public FavouriteController(IFavouriteService favouriteService)
        {
            _favouriteService = favouriteService;
        }
        [HttpGet]
        public async Task<IActionResult> GetFavourites([FromQuery] int userId)
        {
            var favourites = await _favouriteService.GetFavourites(userId);
            return Ok(favourites);
        }
        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavourite([FromBody] AddFavouriteDto dto, [FromQuery] int userId)
        {
            var isSaved = await _favouriteService.ToggleFavouriteAsync(dto, userId);
            return Ok(new {
                isSaved,
                message = isSaved ? "Favourite added." : "Favourite removed"});
        }
        [HttpGet("single")]
        public async Task<IActionResult> GetSingleFavourite([FromQuery] string targetType, [FromQuery] int targetId, [FromQuery] int userId)
        {
            var favourite = await _favouriteService.GetSingleFavouriteAsync(targetType, targetId, userId);
            if (favourite == null)
                return Ok(new { isSaved = false });
            return Ok(new
            {
                isSaved = true,
                notes = favourite.Notes,
                priority = favourite.Priority,
                createdAt = favourite.CreatedAt,
            });
        }

    }
}
