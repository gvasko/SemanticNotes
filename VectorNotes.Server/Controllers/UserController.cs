using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VectorNotes.DomainModel;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize(Policy = "ClientAppWithAuthenticatedUser")]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        public async ActionResult<UserInfoDto> EnsureCreated()
        {
            User? user = null;
            try
            {
                user = await userService.GetCurrentUserAsync();
            }
            catch (InvalidOperationException exc)
            {
                return 
            }
            return Ok();
        }
    }
}
