using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize(Policy = "ClientAppWithAuthenticatedUser")]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public ActionResult<UserInfoDto> EnsureCreated()
        {
            var userData = this.GetUserData();

            if (userData?.Email == null)
            {
                return BadRequest("Authentication error: email not found");
            }

            // TODO: Create user if not exists
            return Ok(new UserInfoDto(-1, userData.Email));
        }
    }
}
