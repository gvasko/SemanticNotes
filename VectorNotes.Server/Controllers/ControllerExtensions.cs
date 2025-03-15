using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    public static class ControllerExtensions
    {
        public static bool HasRole(this ControllerBase controller, string roleName)
        {
            List<string> roleClaims = controller.HttpContext.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
            return roleClaims.Any(r => r == roleName);
        }

        public static UserData GetUserData(this ControllerBase controller)
        {
            string? name = controller.HttpContext.User.FindAll("name").Select(r => r.Value).ToList().FirstOrDefault();
            string? userName = controller.HttpContext.User.FindAll("preferred_username").Select(r => r.Value).ToList().FirstOrDefault();
            string? email = controller.HttpContext.User.FindAll("email").Select(r => r.Value).ToList().FirstOrDefault();
            string? externalId = controller.HttpContext.User.FindAll("http://schemas.microsoft.com/identity/claims/objectidentifier").Select(r => r.Value).ToList().FirstOrDefault();
            return new(name, userName, email, externalId);
        }
    }
}
