using Microsoft.AspNetCore.Mvc;
using SettlyAI.Models;

namespace SettlyAI.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private static readonly List<User> Users = new()
    {
        new User { Id = Guid.NewGuid(), FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" },
        new User { Id = Guid.NewGuid(), FirstName = "Jane", LastName = "Doe", Email = "jane.doe@example.com" }
    };

    [HttpGet]
    public IEnumerable<User> Get()
    {
        return Users;
    }
}
