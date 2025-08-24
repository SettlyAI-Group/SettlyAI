using ISettlyService;
using SettlyModels.Dtos;

namespace SettlyService
{
    public sealed class LayoutNavService: ILayoutNavService
    {
        private static readonly IReadOnlyList<LayoutNavDto> Items = new[]
       {
            new LayoutNavDto { Id = "brand",      Label="Settly",       Path = "/",            Position="left",     Order=0,   Variant="brand"},
            new LayoutNavDto { Id = "about",      Label = "About",      Path = "/about",       Position = "center", Order = 1, Variant = "link" },
            new LayoutNavDto { Id = "features",   Label = "Features",   Path = "/features",    Position = "center", Order = 2, Variant = "menu",
                SubItems = new (){
                    //Remark: Default to Sydney for Explore Suburbs page
                    new LayoutNavDto {Id = "explore", Label="Explore Suburbs", Path="/explore/sydney", Position="center", Order=1, Variant="link"},
                    new LayoutNavDto {Id = "loan-calc", Label="Loan Calculator", Path="/loan-calculator", Position="center", Order=2, Variant="link"},
                    new LayoutNavDto {Id = "super", Label="Settly Super", Path="/super", Position="center", Order=3, Variant="link"},
                }
            },
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
