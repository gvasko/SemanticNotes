using AutoMapper;
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
        private readonly IMapper mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<UserInfoDto>> EnsureCreated()
        {
            var user = await userService.GetCurrentUserAsync();
            var userDto = mapper.Map<UserInfoDto>(user);
            return Ok(userDto);
        }
    }
}
