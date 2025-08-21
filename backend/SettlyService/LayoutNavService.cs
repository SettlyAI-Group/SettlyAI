using ISettlyService;
using SettlyModels.Dtos;

namespace SettlyService
{
    public class LayoutNavService: ILayoutNavService
    {
        private static readonly IReadOnlyList<LayoutNavDto> Items = new[]
       {            
            new LayoutNavDto { Id = "about",      Label = "About",      Path = "/about",       Position = "center", Order = 1, Variant = "link" },
            new LayoutNavDto { Id = "features",   Label = "Features",   Path = "/features",    Position = "center", Order = 2, Variant = "link" },
            new LayoutNavDto { Id = "ask-robot",  Label = "Ask Robot",  Path = "/chat",        Position = "center", Order = 3, Variant = "link" },
            new LayoutNavDto { Id = "favourites", Label = "Favourites", Path = "/favourites",  Position = "center", Order = 4, Variant = "link" },
            new LayoutNavDto { Id = "login",      Label = "Login",      Path = "/login",       Position = "right",  Order = 1, Variant = "text" },
            new LayoutNavDto { Id = "join",       Label = "Join",       Path = "/join",        Position = "right",  Order = 2, Variant = "contained" }
        };

        public async Task<IReadOnlyList<LayoutNavDto>> GetNavbarAsync()
        {
            return await Task.FromResult(Items);
        }
    }
};
