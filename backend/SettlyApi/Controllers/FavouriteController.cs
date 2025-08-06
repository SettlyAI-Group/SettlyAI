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
        public async Task<IActionResult> GetFavourites()
        {
            var userId = 1; //mock data
            var favourites = await _favouriteService.GetFavouritesByUserAsync(userId);
            return Ok(favourites);
        }
        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavourite([FromBody] AddFavouriteDto dto)
        {
            var userId = 1;//mock data
            var isSaved = await _favouriteService.ToggleFavouriteAsync(dto, userId);
            return Ok(new {
                isSaved,
                message = isSaved ? "Favourite added." : "Favourite removed"});
        }
        [HttpGet("single")]
        public async Task<IActionResult> GetSingleFavourite([FromQuery] string targetType, [FromQuery] int targetId)
        {
            var userId = 1;//mock data
            var favourite = await _favouriteService.GetSingleFavouriteAsync(targetType, targetId, userId);
            if (favourite == null)
                return NotFound(new { isSaved = false });
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
